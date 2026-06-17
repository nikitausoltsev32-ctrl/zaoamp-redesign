'use client'

import { Phone } from 'lucide-react'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'

export function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <a
        href={`tel:${contactInfo.whatsapp}`}
        onClick={() => ymGoal('phone_click')}
        aria-label="Позвонить"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-sapphire text-white shadow-lg hover:bg-brand-sapphire-dark transition-colors active:scale-95"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  )
}
