-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Contracts Table
create table if not exists contracts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid default auth.uid(),
  name text not null,
  client_name text,
  type text default 'general',
  status text default 'uploaded', -- uploaded, analyzing, analyzed, failed
  risk_level text default 'unknown', -- low, medium, high, unknown
  score integer default 0,
  content text, -- Stores the original text content
  analysis jsonb, -- Stores the full analysis result
  current_version integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Contract Versions Table (for versioning)
create table if not exists contract_versions (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid references contracts(id) on delete cascade not null,
  version_number integer not null,
  content text not null, -- Content of this specific version
  changes_summary text,
  analysis jsonb, -- Analysis specific to this version
  created_by uuid default auth.uid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'analyzed'
);

-- RLS Policies (Row Level Security)
alter table contracts enable row level security;
alter table contract_versions enable row level security;

-- Policy: Users can only see their own contracts
create policy "Users can view their own contracts"
  on contracts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own contracts"
  on contracts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own contracts"
  on contracts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own contracts"
  on contracts for delete
  using (auth.uid() = user_id);

-- Policy: Users can see versions of their contracts
create policy "Users can view versions of their contracts"
  on contract_versions for select
  using (
    exists (
      select 1 from contracts
      where contracts.id = contract_versions.contract_id
      and contracts.user_id = auth.uid()
    )
  );

create policy "Users can insert versions for their contracts"
  on contract_versions for insert
  with check (
    exists (
      select 1 from contracts
      where contracts.id = contract_versions.contract_id
      and contracts.user_id = auth.uid()
    )
  );
