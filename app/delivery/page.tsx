'use client'

import { SectionHeader } from '@/components/section-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Truck, ArrowRight, Check } from 'lucide-react'


export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-brand-ice-blue">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Условия доставки"
            subtitle="Доставка мраморной крошки и щебня по всей России"
            centered
          />
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              <Truck className="mr-1 h-3 w-3" />
              Автотранспорт
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Ж/Д перевозки
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Самовывоз
            </Badge>
          </div>
        </div>
      </div>

      {/* Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Важная информация
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Минимальный заказ</h3>
                  <p className="text-muted-foreground text-sm">
                    Доставка осуществляется от 20 тонн. Для меньших объемов — самовывоз.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Оплата</h3>
                  <p className="text-muted-foreground text-sm">
                    Работаем по предоплате 50% или по договору с отсрочкой платежа для постоянных клиентов.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Документы</h3>
                  <p className="text-muted-foreground text-sm">
                    Предоставляем все необходимые документы: сертификаты, паспорта качества, ТТН.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Ж/Д перевозки</h3>
                  <p className="text-muted-foreground text-sm">
                    Для крупных заказов от 100 тонн возможна доставка железнодорожным транспортом.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-brand-sapphire to-brand-deep-navy">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Рассчитайте точную стоимость
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Используйте наш калькулятор для расчета стоимости с учетом доставки в ваш регион
          </p>
          <Button asChild size="lg" className="bg-brand-ice-blue text-brand-sapphire hover:bg-brand-ice-blue/90">
            <Link href="/#calculator">
              Открыть калькулятор
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
