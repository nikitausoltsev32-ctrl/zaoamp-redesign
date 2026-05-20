create table if not exists public.ai_assistant_leads (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  name text,
  phone text,
  city text,
  need text,
  product_interest text,
  quantity_tons numeric,
  packaging text,
  budget text,
  summary text,
  messages jsonb not null default '[]'::jsonb,
  source_path text,
  provider text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_assistant_leads_updated_at_idx
  on public.ai_assistant_leads (updated_at desc);

create index if not exists ai_assistant_leads_phone_idx
  on public.ai_assistant_leads (phone);

alter table public.ai_assistant_leads enable row level security;
