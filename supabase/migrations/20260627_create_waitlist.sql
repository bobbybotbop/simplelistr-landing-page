create table public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  user_id     uuid        not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);
