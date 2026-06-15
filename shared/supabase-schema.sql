-- Akabane Diagnostic · Supabase schema for cloud patient cabinet

create extension if not exists pgcrypto;

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  note text,
  status text default 'new',
  next_visit timestamptz,
  paid boolean default false,
  paid_amount numeric default 0,
  payment_date timestamptz,
  therapy_sessions integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
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
  file_url text,
  file_name text,
  file_type text,
  created_at timestamptz default now()
);

create table if not exists therapy_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  session_number integer,
  session_date timestamptz default now(),
  note text,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  amount numeric not null,
  method text default 'manual',
  comment text,
  file_url text,
  file_name text,
  file_type text,
  payment_date timestamptz default now(),
  created_at timestamptz default now()
);

alter table patients enable row level security;
alter table diagnostics enable row level security;
alter table messages enable row level security;
alter table therapy_sessions enable row level security;
alter table payments enable row level security;

drop policy if exists "patients public select" on patients;
drop policy if exists "patients public insert" on patients;
drop policy if exists "patients public update" on patients;
drop policy if exists "diagnostics public select" on diagnostics;
drop policy if exists "diagnostics public insert" on diagnostics;
drop policy if exists "messages public select" on messages;
drop policy if exists "messages public insert" on messages;
drop policy if exists "therapy_sessions public select" on therapy_sessions;
drop policy if exists "therapy_sessions public insert" on therapy_sessions;
drop policy if exists "payments public select" on payments;
drop policy if exists "payments public insert" on payments;

create policy "patients public select" on patients for select to anon using (true);
create policy "patients public insert" on patients for insert to anon with check (full_name is not null and length(full_name) > 0);
create policy "patients public update" on patients for update to anon using (true);

create policy "diagnostics public select" on diagnostics for select to anon using (true);
create policy "diagnostics public insert" on diagnostics for insert to anon with check (patient_id is not null);

create policy "messages public select" on messages for select to anon using (true);
create policy "messages public insert" on messages for insert to anon with check (patient_id is not null and message is not null and length(message) > 0);

create policy "therapy_sessions public select" on therapy_sessions for select to anon using (true);
create policy "therapy_sessions public insert" on therapy_sessions for insert to anon with check (patient_id is not null);

create policy "payments public select" on payments for select to anon using (true);
create policy "payments public insert" on payments for insert to anon with check (patient_id is not null and amount is not null);
