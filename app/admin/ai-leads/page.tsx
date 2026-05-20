import type { Metadata } from 'next'
import { AiLeadsAdmin } from '@/components/admin/ai-leads-admin'

export const metadata: Metadata = {
  title: 'Заявки AI-менеджера | ЗАО АМП',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AiLeadsPage() {
  return <AiLeadsAdmin />
}
