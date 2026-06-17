'use client'

import { Button } from '@/components/ui/button'
import { Package, CheckCircle2, Phone, MessageCircle } from 'lucide-react'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'

export function SamplesCTA() {
  return (
    <section className="py-12 bg-brand-sapphire text-white border-y border-brand-sapphire-dark mt-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4">
              <Package className="h-4 w-4" /> B2B Клиентам
            </div>
            <h2 className="text-3xl font-bold mb-4">Сомневаетесь во фракции или цвете?</h2>
            <p className="text-brand-sapphire-light text-lg mb-6 leading-relaxed">
              Мы бесплатно отправим вам коробку с образцами нашей продукции (7 фракций крошки и щебня). Вы оплачиваете только услуги транспортной компании при получении.
            </p>
            <ul className="space-y-2 mb-8 text-brand-sapphire-light">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-white/80" /> Вживую оцените белизну 98%</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-white/80" /> Точно подберете фракцию для своих задач</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-white/80" /> Проверите прочность и качество</li>
            </ul>
          </div>
          
          <div className="bg-white text-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl text-center">
            <h3 className="text-xl font-bold mb-2">Заказать набор образцов</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Позвоните менеджеру — уточним фракции, адрес доставки и оформим отправку образцов.
            </p>

            <a
              href={`tel:${contactInfo.whatsapp}`}
              onClick={() => ymGoal('phone_click')}
              className="block text-2xl font-bold text-brand-sapphire transition-colors hover:text-brand-sapphire-dark"
            >
              {contactInfo.phone}
            </a>

            <div className="mt-5 flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
              >
                <a href={`tel:${contactInfo.whatsapp}`} onClick={() => ymGoal('phone_click')}>
                  <Phone className="mr-2 h-4 w-4" /> Позвонить
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
              >
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => ymGoal('whatsapp_click')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Написать в WhatsApp
                </a>
              </Button>
            </div>

            <p className="text-xs text-center text-stone-500 mt-5">
              {contactInfo.workingHours}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
