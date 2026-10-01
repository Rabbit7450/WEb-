create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists status text not null default 'active'
  check (status in ('active', 'inactive'));

alter table public.profiles
  add column if not exists business_id uuid references public.businesses (id) on delete set null;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is distinct from u.email;

alter table public.promotions
  add column if not exists link_url text;

alter type public.promotion_status add value if not exists 'sold_out';

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to anon, authenticated;

drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own"
  on public.admin_users for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (
    id = (select auth.uid())
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

grant select on table public.cities to anon, authenticated;
grant insert on table public.cities to authenticated;
grant select on table public.businesses to anon, authenticated;
grant select, insert, update, delete on table public.businesses to authenticated;
grant select on table public.profiles to authenticated;

drop policy if exists "cities_insert_admin" on public.cities;
create policy "cities_insert_admin"
  on public.cities for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

drop policy if exists "businesses_insert_own" on public.businesses;
drop policy if exists "businesses_insert_own_or_admin" on public.businesses;
create policy "businesses_insert_own_or_admin"
  on public.businesses for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

drop policy if exists "businesses_update_own" on public.businesses;
drop policy if exists "businesses_update_own_or_admin" on public.businesses;
create policy "businesses_update_own_or_admin"
  on public.businesses for update
  to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  )
  with check (
    owner_id = (select auth.uid())
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

drop policy if exists "businesses_delete_own" on public.businesses;
drop policy if exists "businesses_delete_own_or_admin" on public.businesses;
create policy "businesses_delete_own_or_admin"
  on public.businesses for delete
  to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email
  )
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create or replace function public.sync_auth_user_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$$;

revoke execute on function public.sync_auth_user_email() from public, anon, authenticated;
drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.sync_auth_user_email();

drop policy if exists "promotions_select_published" on public.promotions;
create policy "promotions_select_published"
  on public.promotions for select
  using (
    status = 'published'
    or exists (
      select 1
      from public.businesses b
      where b.id = promotions.business_id
        and b.owner_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

drop policy if exists "promotions_insert_own_business" on public.promotions;
create policy "promotions_insert_own_business"
  on public.promotions for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.businesses b
      where b.id = business_id
        and b.owner_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

drop policy if exists "promotions_update_own_business" on public.promotions;
create policy "promotions_update_own_business"
  on public.promotions for update
  to authenticated
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = promotions.business_id
        and b.owner_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.businesses b
      where b.id = promotions.business_id
        and b.owner_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

drop policy if exists "promotions_delete_own_business" on public.promotions;
create policy "promotions_delete_own_business"
  on public.promotions for delete
  to authenticated
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = promotions.business_id
        and b.owner_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  );

notify pgrst, 'reload schema';
