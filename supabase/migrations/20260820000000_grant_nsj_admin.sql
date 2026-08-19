-- Grants the existing Supabase Auth account an administrator role.
-- This is safe to run more than once and does not alter product data or RLS.
insert into public.admin_users (user_id)
values ('1af7aedb-c9b7-492e-bd3f-da0ad86e8443')
on conflict (user_id) do nothing;
