import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Truck } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { generateDeliveryMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema, JsonLd } from '@/lib/seo/schema'

export const metadata: Metadata = generateDeliveryMetadata()

export default function DeliveryPage() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: '/' },
    { name: 'Доставка', item: '/delivery' },
  ])

  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="min-h-screen bg-brand-ice-blue">
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

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Важная информация</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Как считается стоимость</h3>
                    <p className="text-muted-foreground text-sm">
                      Предварительный расчёт делаем в день обращения. Точная цена зависит от объёма,
                      упаковки, адреса выгрузки и выбранного способа доставки.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Как проходит отгрузка</h3>
                    <p className="text-muted-foreground text-sm">
                      Отгружаем навалом, в биг-бэгах 500 кг и 1 т, а для части позиций также в мешках.
                      Доступны авто, ж/д и самовывоз по согласованию.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Работаем по договору</h3>
                    <p className="text-muted-foreground text-sm">
                      Согласовываем условия поставки под объект, регион и формат закупки, готовим комплект
                      отгрузочных документов и сопровождаем сделку до выгрузки.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Паспорта качества</h3>
                    <p className="text-muted-foreground text-sm">
                      Доступные паспорта качества опубликованы на сайте. Если нужен документ на конкретную
                      позицию или партию, уточните это при запросе расчёта.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-brand-sapphire to-brand-deep-navy">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Рассчитаем стоимость под ваш объект и регион
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Используйте калькулятор для предварительного расчёта и уточняйте итоговую стоимость по
              объёму, упаковке и доставке.
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
    </>
  )
}
