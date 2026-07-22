-- ===========================================================================
-- Accountant Portal – Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- ===========================================================================

-- Profiles -------------------------------------------------------------------
-- One row per Clerk user. Clients start as 'pending' and must be approved by an
-- accountant (admin) before they can access the portal.
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     text unique not null,            -- Clerk user id
  email       text,
  full_name   text,
  role        text not null default 'client'   check (role   in ('client', 'admin')),
  status      text not null default 'pending'  check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_status_idx on public.profiles (status);
create index if not exists profiles_role_idx   on public.profiles (role);

-- Documents ------------------------------------------------------------------
-- Files prepared by the accountant, assigned to a specific client profile.
create table if not exists public.documents (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles (id) on delete cascade,
  title         text not null,
  category      text not null default 'Other',   -- e.g. Tax Return, Annual Report
  year          int,
  file_name     text,
  storage_path  text not null,                    -- path within the Storage bucket
  size_bytes    bigint,
  uploaded_by   text,                             -- Clerk user id of the accountant
  created_at    timestamptz not null default now()
);

create index if not exists documents_owner_idx on public.documents (owner_id);

-- updated_at trigger for profiles -------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Row Level Security ---------------------------------------------------------
-- All access goes through the Next.js server using the service-role key, which
-- bypasses RLS. We still enable RLS so nothing is readable with the anon key.
alter table public.profiles  enable row level security;
alter table public.documents enable row level security;

-- ===========================================================================
-- Storage bucket
-- ===========================================================================
-- Create a PRIVATE bucket named 'documents' (matches SUPABASE_DOCUMENTS_BUCKET).
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;
