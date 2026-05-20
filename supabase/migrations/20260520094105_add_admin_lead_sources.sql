alter table public.ai_assistant_leads
  add column if not exists lead_type text not null default 'ai_assistant',
  add column if not exists email text,
  add column if not exists product_slug text,
  add column if not exists order_subtotal numeric,
  add column if not exists source_label text,
  add column if not exists raw_payload jsonb not null default '{}'::jsonb;

create index if not exists ai_assistant_leads_lead_type_updated_at_idx
  on public.ai_assistant_leads (lead_type, updated_at desc);

create index if not exists ai_assistant_leads_email_idx
  on public.ai_assistant_leads (email);
