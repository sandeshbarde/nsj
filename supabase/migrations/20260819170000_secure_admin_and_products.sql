-- Run with `supabase db push` or paste into the Supabase SQL editor.
-- Assign the first administrator after creating that user's Auth account:
-- insert into public.admin_users (user_id) values ('<auth-user-uuid>');

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Users can read their own admin grant"
  on public.admin_users for select to authenticated
  using ((select auth.uid()) = user_id);

alter table public.products enable row level security;

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
