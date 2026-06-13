-- Akabane Diagnostic · Supabase schema for cloud patient cabinet

create extension if not exists pgcrypto;

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

drop policy if exists "patients public select" on patients;
drop policy if exists "patients public insert" on patients;
drop policy if exists "diagnostics public select" on diagnostics;
drop policy if exists "diagnostics public insert" on diagnostics;
drop policy if exists "messages public select" on messages;
drop policy if exists "messages public insert" on messages;

create policy "patients public select" on patients for select to anon using (true);
create policy "patients public insert" on patients for insert to anon with check (full_name is not null and length(full_name) > 0);

create policy "diagnostics public select" on diagnostics for select to anon using (true);
create policy "diagnostics public insert" on diagnostics for insert to anon with check (patient_id is not null);

create policy "messages public select" on messages for select to anon using (true);
create policy "messages public insert" on messages for insert to anon with check (patient_id is not null and message is not null and length(message) > 0);
