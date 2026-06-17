'use client'

import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import { m } from 'framer-motion'
import { ymGoal } from '@/lib/analytics'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-sapphire via-blue-600 to-brand-deep-navy">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-white mb-4 sm:text-4xl">
            Нужна консультация?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Наши специалисты помогут подобрать оптимальную фракцию мрамора под ваши задачи. 
            Ответим на все вопросы и рассчитаем стоимость.
          </p>
          
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-brand-ice-blue text-brand-sapphire hover:bg-brand-ice-blue/90"
            >
              <a href="tel:+79193931992" onClick={() => ymGoal('phone_click')}>
                <Phone className="mr-2 h-4 w-4" />
                Позвонить +7 (919) 393-19-92
              </a>
            </Button>
          </div>

          <p className="mt-6 text-sm text-white/80">
            Звоните в рабочее время — ответим на все вопросы и рассчитаем стоимость.
          </p>
        </m.div>
      </div>
    </section>
  )
}
