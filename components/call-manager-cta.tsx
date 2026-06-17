'use client'

import { Phone, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface CallManagerCTAProps {
  title?: string
  subtitle?: string
  className?: string
}

/**
 * Единый блок «Позвоните менеджеру».
 * Заменяет формы сбора персональных данных (152-ФЗ): связь идёт только
 * по телефону, никакие данные на сайте не собираются.
 */
export function CallManagerCTA({
  title = 'Позвоните нашему менеджеру',
  subtitle = 'Рассчитаем стоимость, подберём фракцию и оформим заказ по телефону',
  className,
}: CallManagerCTAProps) {
  const digits = contactInfo.whatsapp

  return (
    <div
      className={cn(
        'rounded-2xl border border-brand-sapphire/20 bg-brand-ice-blue/50 p-6 text-center',
        className
      )}
    >
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

      <a
        href={`tel:${digits}`}
        onClick={() => ymGoal('phone_click')}
        className="mt-4 inline-block text-2xl font-bold text-brand-sapphire transition-colors hover:text-brand-sapphire-dark"
      >
        {contactInfo.phone}
      </a>

      <div className="mt-4 flex justify-center">
        <Button asChild size="lg" className="bg-brand-sapphire hover:bg-brand-sapphire-dark">
          <a href={`tel:${digits}`} onClick={() => ymGoal('phone_click')}>
            <Phone className="mr-2 h-4 w-4" />
            Позвонить
          </a>
        </Button>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        {contactInfo.workingHours}
      </p>
    </div>
  )
}
