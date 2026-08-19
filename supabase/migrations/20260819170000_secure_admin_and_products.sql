-- Run with `supabase db push` or paste into the Supabase SQL editor.
-- Assign the first administrator after creating that user's Auth account:
-- insert into public.admin_users (user_id) values ('<auth-user-uuid>');

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Users can read their own admin grant" on public.admin_users;
create policy "Users can read their own admin grant"
  on public.admin_users for select to authenticated
  using ((select auth.uid()) = user_id);

-- Products needs text IDs because the admin UI generates IDs such as NSJ-123456.
-- This creates the table on a fresh project; an existing empty legacy table should
-- be dropped before running this migration (see the setup instructions).
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  category text not null default 'Rings',
  price numeric not null default 0,
  mrp numeric not null default 0,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

alter table public.products
  add column if not exists category text not null default 'Rings',
  add column if not exists image text,
  add column if not exists gallery jsonb not null default '[]'::jsonb,
  add column if not exists video text,
  add column if not exists description text,
  add column if not exists purity text,
  add column if not exists weight_grams numeric,
  add column if not exists featured boolean not null default false,
  add column if not exists published boolean not null default true,
  add column if not exists created_at timestamptz not null default now();

drop policy if exists "Anyone can view published products" on public.products;
drop policy if exists "Admins can view all products" on public.products;
drop policy if exists "Admins can create products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;
create policy "Anyone can view published products"
  on public.products for select to anon, authenticated
  using (published = true);

create policy "Admins can view all products"
  on public.products for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can create products"
  on public.products for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can update products"
  on public.products for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can delete products"
  on public.products for delete to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create table if not exists public.site_media (
  key text primary key check (key in ('hero', 'craft', 'rings', 'earrings', 'necklaces', 'bracelets')),
  image_url text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_media enable row level security;

drop policy if exists "Anyone can view site media" on public.site_media;
drop policy if exists "Admins can manage site media" on public.site_media;
create policy "Anyone can view site media"
  on public.site_media for select to anon, authenticated using (true);

create policy "Admins can manage site media"
  on public.site_media for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
  on conflict (id) do update set public = true;

drop policy if exists "Admins can upload site media" on storage.objects;
drop policy if exists "Admins can update site media" on storage.objects;
drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can upload site media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can update site media"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (bucket_id = 'site-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can delete site media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public) values ('product-media', 'product-media', true)
  on conflict (id) do update set public = true;

drop policy if exists "Admins can upload product media" on storage.objects;
drop policy if exists "Admins can update product media" on storage.objects;
drop policy if exists "Admins can delete product media" on storage.objects;
create policy "Admins can upload product media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can update product media"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (bucket_id = 'product-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can delete product media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

do $$ begin
  alter publication supabase_realtime add table public.products;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter publication supabase_realtime add table public.site_media;
exception when duplicate_object then null;
end $$;
