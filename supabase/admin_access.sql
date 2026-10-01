create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.promotions
  add column if not exists link_url text;

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to anon, authenticated;

drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own"
  on public.admin_users for select
  to authenticated
  using ((select auth.uid()) = user_id);

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
