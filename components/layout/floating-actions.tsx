'use client'

import { Phone, MessageCircle } from 'lucide-react'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'

export function FloatingActions() {
  return (
    <div className="lg:hidden fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${contactInfo.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => ymGoal('whatsapp_click')}
        aria-label="Написать в WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors active:scale-95"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
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
