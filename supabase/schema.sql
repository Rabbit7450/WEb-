-- Yaps — esquema inicial para Supabase
-- Cómo usarlo: SQL Editor → New query → pegar este archivo → Run

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'business', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'promotion_status') then
    create type public.promotion_status as enum (
      'draft',
      'pending',
      'published',
      'expired',
      'rejected'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Ciudades
-- ---------------------------------------------------------------------------

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text not null,
  slug text not null unique,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Categorías
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Perfiles (1:1 con auth.users)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Negocios
-- ---------------------------------------------------------------------------

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  city_id uuid references public.cities (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  address text,
  phone text,
  website text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_owner_id_idx on public.businesses (owner_id);
create index if not exists businesses_city_id_idx on public.businesses (city_id);

-- ---------------------------------------------------------------------------
-- Promociones
-- ---------------------------------------------------------------------------

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  city_id uuid references public.cities (id) on delete set null,
  title text not null,
  description text,
  image_url text,
  original_price numeric(12, 2),
  promo_price numeric(12, 2),
  discount_percent integer,
  starts_at timestamptz,
  ends_at timestamptz,
  status public.promotion_status not null default 'draft',
  is_featured boolean not null default false,
  views_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_prices_check check (
    original_price is null
    or promo_price is null
    or promo_price <= original_price
  ),
  constraint promotions_discount_check check (
    discount_percent is null
    or (discount_percent >= 0 and discount_percent <= 100)
  )
);

create index if not exists promotions_status_idx on public.promotions (status);
create index if not exists promotions_category_id_idx on public.promotions (category_id);
create index if not exists promotions_city_id_idx on public.promotions (city_id);
create index if not exists promotions_business_id_idx on public.promotions (business_id);
create index if not exists promotions_featured_idx on public.promotions (is_featured)
  where status = 'published';
create index if not exists promotions_ends_at_idx on public.promotions (ends_at);

-- ---------------------------------------------------------------------------
-- Favoritos
-- ---------------------------------------------------------------------------

create table if not exists public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  promotion_id uuid not null references public.promotions (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, promotion_id)
);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

drop trigger if exists promotions_set_updated_at on public.promotions;
create trigger promotions_set_updated_at
  before update on public.promotions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Perfil automático al registrarse
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.cities enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.promotions enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "cities_select_all" on public.cities;
create policy "cities_select_all"
  on public.cities for select
  using (true);

drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all"
  on public.categories for select
  using (true);

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "businesses_select_all" on public.businesses;
create policy "businesses_select_all"
  on public.businesses for select
  using (true);

drop policy if exists "businesses_insert_own" on public.businesses;
create policy "businesses_insert_own"
  on public.businesses for insert
  with check (auth.uid() = owner_id);

drop policy if exists "businesses_update_own" on public.businesses;
create policy "businesses_update_own"
  on public.businesses for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "businesses_delete_own" on public.businesses;
create policy "businesses_delete_own"
  on public.businesses for delete
  using (auth.uid() = owner_id);

drop policy if exists "promotions_select_published" on public.promotions;
create policy "promotions_select_published"
  on public.promotions for select
  using (
    status = 'published'
    or exists (
      select 1
      from public.businesses b
      where b.id = promotions.business_id
        and b.owner_id = auth.uid()
    )
  );

drop policy if exists "promotions_insert_own_business" on public.promotions;
create policy "promotions_insert_own_business"
  on public.promotions for insert
  with check (
    exists (
      select 1
      from public.businesses b
      where b.id = business_id
        and b.owner_id = auth.uid()
    )
  );

drop policy if exists "promotions_update_own_business" on public.promotions;
create policy "promotions_update_own_business"
  on public.promotions for update
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = promotions.business_id
        and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.businesses b
      where b.id = promotions.business_id
        and b.owner_id = auth.uid()
    )
  );

drop policy if exists "promotions_delete_own_business" on public.promotions;
create policy "promotions_delete_own_business"
  on public.promotions for delete
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = promotions.business_id
        and b.owner_id = auth.uid()
    )
  );

drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage (imágenes de promociones y logos)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('promotion-images', 'promotion-images', true),
  ('business-logos', 'business-logos', true)
on conflict (id) do nothing;

drop policy if exists "promotion_images_public_read" on storage.objects;
create policy "promotion_images_public_read"
  on storage.objects for select
  using (bucket_id in ('promotion-images', 'business-logos'));

drop policy if exists "media_insert_authenticated" on storage.objects;
create policy "media_insert_authenticated"
  on storage.objects for insert
  with check (
    bucket_id in ('promotion-images', 'business-logos')
    and auth.role() = 'authenticated'
  );

drop policy if exists "media_update_own" on storage.objects;
create policy "media_update_own"
  on storage.objects for update
  using (
    bucket_id in ('promotion-images', 'business-logos')
    and auth.uid() = owner
  );

drop policy if exists "media_delete_own" on storage.objects;
create policy "media_delete_own"
  on storage.objects for delete
  using (
    bucket_id in ('promotion-images', 'business-logos')
    and auth.uid() = owner
  );

-- ---------------------------------------------------------------------------
-- Datos iniciales
-- ---------------------------------------------------------------------------

insert into public.cities (name, department, slug, latitude, longitude)
values
  ('La Paz', 'La Paz', 'la-paz', -16.5000000, -68.1500000),
  ('El Alto', 'La Paz', 'el-alto', -16.5047000, -68.1635000),
  ('Santa Cruz de la Sierra', 'Santa Cruz', 'santa-cruz', -17.7833000, -63.1821000),
  ('Cochabamba', 'Cochabamba', 'cochabamba', -17.3895000, -66.1568000),
  ('Sucre', 'Chuquisaca', 'sucre', -19.0333000, -65.2627000),
  ('Oruro', 'Oruro', 'oruro', -17.9833000, -67.1500000),
  ('Potosí', 'Potosí', 'potosi', -19.5836000, -65.7531000),
  ('Tarija', 'Tarija', 'tarija', -21.5355000, -64.7296000),
  ('Trinidad', 'Beni', 'trinidad', -14.8333000, -64.9000000),
  ('Cobija', 'Pando', 'cobija', -11.0267000, -68.7692000)
on conflict (slug) do nothing;

insert into public.categories (name, slug, icon, sort_order)
values
  ('Restaurantes', 'restaurantes', '🍽️', 1),
  ('Moda', 'moda', '👕', 2),
  ('Tecnología', 'tecnologia', '📱', 3),
  ('Salud', 'salud', '💊', 4),
  ('Turismo', 'turismo', '✈️', 5),
  ('Hogar', 'hogar', '🏠', 6),
  ('Belleza', 'belleza', '💄', 7),
  ('Deportes', 'deportes', '⚽', 8),
  ('Educación', 'educacion', '📚', 9),
  ('Automotriz', 'automotriz', '🚗', 10),
  ('Mascotas', 'mascotas', '🐶', 11),
  ('Otros', 'otros', '🏷️', 12)
on conflict (slug) do nothing;
