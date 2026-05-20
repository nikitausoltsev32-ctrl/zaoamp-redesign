'use client'

import { FormEvent, useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AiLeadRow {
  id: string
  session_id: string
  name: string | null
  phone: string | null
  city: string | null
  need: string | null
  product_interest: string | null
  quantity_tons: number | null
  packaging: string | null
  budget: string | null
  summary: string | null
  source_path: string | null
  provider: string | null
  status: string
  updated_at: string
  created_at: string
}

export function AiLeadsAdmin() {
  const [token, setToken] = useState('')
  const [leads, setLeads] = useState<AiLeadRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadLeads = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (!token.trim()) {
      setError('Введите ADMIN_TOKEN')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/ai-leads', {
        headers: { 'x-admin-token': token.trim() },
      })
      const data = await response.json() as { leads?: AiLeadRow[]; error?: string }

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось загрузить заявки')
      }

      setLeads(data.leads ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить заявки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-sapphire">Админка</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-brand-deep-navy md:text-4xl">
            Заявки AI-менеджера
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Здесь видны интересы посетителей, подобранные продукты и контактные данные из чата.
          </p>
        </div>

        <form onSubmit={loadLeads} className="flex w-full gap-2 md:w-auto">
          <Input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="ADMIN_TOKEN"
            className="md:w-64"
          />
          <Button type="submit" disabled={loading} className="gap-2 bg-brand-sapphire hover:bg-brand-sapphire-dark">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Загрузить
          </Button>
        </form>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-brand-deep-navy">
                    {lead.phone || lead.name || lead.product_interest || 'Новый интерес'}
                  </h2>
                  <span className="rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-600">
                    {lead.provider || 'provider unknown'}
                  </span>
                  <span className="rounded-md bg-brand-sapphire/10 px-2 py-1 text-xs text-brand-sapphire">
                    {lead.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  {new Date(lead.updated_at || lead.created_at).toLocaleString('ru-RU')}
                  {lead.source_path ? ` | ${lead.source_path}` : ''}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
              <Info label="Имя" value={lead.name} />
              <Info label="Телефон" value={lead.phone} />
              <Info label="Город" value={lead.city} />
              <Info label="Продукт" value={lead.product_interest} />
              <Info label="Объем" value={lead.quantity_tons ? `${lead.quantity_tons} т` : null} />
              <Info label="Упаковка" value={lead.packaging} />
              <Info label="Бюджет" value={lead.budget} />
              <Info label="Задача" value={lead.need} />
              <Info label="Резюме" value={lead.summary} />
            </div>
          </article>
        ))}
      </div>

      {!loading && leads.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500">
          Введите админ-токен и загрузите заявки.
        </div>
      )}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-1 break-words text-stone-800">{value || '-'}</p>
    </div>
  )
}
