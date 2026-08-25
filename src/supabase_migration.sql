-- ============================================================
-- NSJ Jewellery — Supabase SQL Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Product Reviews Table
create table if not exists product_reviews (
  id          uuid default gen_random_uuid() primary key,
  product_id  text not null,
  name        text not null,
  rating      int  not null check (rating >= 1 and rating <= 5),
  review_text text not null,
  created_at  timestamptz default now()
);

alter table product_reviews enable row level security;
create policy "Reviews readable by all"
  on product_reviews for select using (true);
create policy "Anyone can submit review"
  on product_reviews for insert with check (
    length(trim(name)) >= 2 and
    length(trim(review_text)) >= 5 and
    rating between 1 and 5
  );

-- 2. Contact Messages Table
create table if not exists contact_messages (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;
create policy "Anyone can submit contact form"
  on contact_messages for insert with check (
    length(trim(name)) >= 2 and
    length(trim(email)) >= 5 and
    length(trim(message)) >= 5
  );
