-- Запустить один раз в Supabase → SQL Editor
alter table patients add column if not exists calendar_name text;

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz,
  calendar_event_id text unique,
  calendar_title text,
  status text not null default 'planned',  -- planned | came | missed | moved
  note text,
  created_at timestamptz default now()
);
create index if not exists appointments_patient_idx on appointments(patient_id, start_at);

alter table appointments enable row level security;
drop policy if exists "appointments public select" on appointments;
drop policy if exists "appointments public insert" on appointments;
drop policy if exists "appointments public update" on appointments;
drop policy if exists "appointments public delete" on appointments;
create policy "appointments public select" on appointments for select to anon using (true);
create policy "appointments public insert" on appointments for insert to anon with check (patient_id is not null);
create policy "appointments public update" on appointments for update to anon using (true);
create policy "appointments public delete" on appointments for delete to anon using (true);
