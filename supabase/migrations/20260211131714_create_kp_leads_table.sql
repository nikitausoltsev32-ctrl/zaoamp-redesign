-- Таблица для хранения заявок на КП (коммерческое предложение)
-- Источник: форма "Получить КП за 3 минуты" в Hero-секции

create table if not exists public.kp_leads (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  source text default 'hero',
  created_at timestamptz default now()
);

-- Индекс по дате для быстрой выборки
create index if not exists kp_leads_created_at_idx on public.kp_leads (created_at desc);

-- RLS: вставка через API route с service_role (обходит RLS)
-- Для чтения в админке добавить policy для authenticated
alter table public.kp_leads enable row level security;

-- Никаких публичных policy: доступ только через service_role (API route)
