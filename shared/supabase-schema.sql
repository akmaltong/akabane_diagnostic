-- Akabane Diagnostic · Supabase schema
-- Prototype mode: public anon access is enabled through RLS policies.
-- For production, replace these policies with Supabase Auth based access.

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  created_at timestamptz default now()
);

create table if not exists diagnostics (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  result_json jsonb,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  author text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table patients enable row level security;
alter table diagnostics enable row level security;
alter table messages enable row level security;

drop policy if exists "prototype patients select" on patients;
drop policy if exists "prototype patients insert" on patients;
drop policy if exists "prototype patients update" on patients;
drop policy if exists "prototype diagnostics select" on diagnostics;
drop policy if exists "prototype diagnostics insert" on diagnostics;
drop policy if exists "prototype diagnostics update" on diagnostics;
drop policy if exists "prototype messages select" on messages;
drop policy if exists "prototype messages insert" on messages;
drop policy if exists "prototype messages update" on messages;

create policy "prototype patients select"
on patients for select
to anon
using (true);

create policy "prototype patients insert"
on patients for insert
to anon
with check (true);

create policy "prototype patients update"
on patients for update
to anon
using (true)
with check (true);

create policy "prototype diagnostics select"
on diagnostics for select
to anon
using (true);

create policy "prototype diagnostics insert"
on diagnostics for insert
to anon
with check (true);

create policy "prototype diagnostics update"
on diagnostics for update
to anon
using (true)
with check (true);

create policy "prototype messages select"
on messages for select
to anon
using (true);

create policy "prototype messages insert"
on messages for insert
to anon
with check (true);

create policy "prototype messages update"
on messages for update
to anon
using (true)
with check (true);
