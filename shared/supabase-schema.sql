create table patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  created_at timestamptz default now()
);

create table diagnostics (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  result_json jsonb,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  author text not null,
  message text not null,
  created_at timestamptz default now()
);
