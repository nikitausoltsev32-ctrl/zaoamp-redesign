'use client'

import { m } from 'framer-motion'
import { BadgeCheck, FileText, MapPinned, MessageSquareQuote, Truck } from 'lucide-react'

const BUSINESS_BLOCKS = [
  {
    icon: MessageSquareQuote,
    title: 'Как считаем стоимость',
    text: 'Делаем предварительный расчёт в день обращения. Итоговая цена зависит от объёма, упаковки, способа отгрузки и региона поставки.',
  },
  {
    icon: Truck,
    title: 'Как проходит отгрузка',
    text: 'Поставляем навалом, в биг-бэгах 500 кг и 1 т, а для части позиций также в мешках. Доступны авто, ж/д и самовывоз по согласованию.',
  },
  {
    icon: FileText,
    title: 'Какие документы доступны',
    text: 'На сайте размещены подтверждённые паспорта качества для части номенклатуры. По остальным позициям наличие документов уточняем под запрос.',
  },
  {
    icon: BadgeCheck,
    title: 'Как работаем с B2B',
    text: 'Согласовываем фракцию, упаковку, объём и график поставки под объект. Работаем по договору и сопровождаем сделку до выгрузки.',
  },
]

const GEOGRAPHIES = [
  { label: 'Россия', desc: 'Доставка в любой регион — авто и ж/д' },
  { label: 'Беларусь', desc: 'Работаем с белорусскими предприятиями напрямую' },
  { label: 'Казахстан', desc: 'Поставки с полным пакетом документов для ВЭД' },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Как работаем с поставками
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Без обещаний в воздухе: считаем стоимость под задачу, согласовываем отгрузку и даём
            понятный комплект документов по доступной номенклатуре.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {GEOGRAPHIES.map((geo) => (
            <div
              key={geo.label}
              className="bg-white rounded-xl border border-stone-200 px-5 py-4 flex gap-3 items-start"
            >
              <div className="h-8 w-8 shrink-0 rounded-full bg-brand-sapphire/10 flex items-center justify-center text-brand-sapphire font-bold text-xs mt-0.5">
                <MapPinned className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{geo.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{geo.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {BUSINESS_BLOCKS.map((block, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col gap-4"
            >
              <block.icon className="h-5 w-5 text-brand-sapphire/60 shrink-0" />
              <p className="text-sm font-semibold text-gray-900">{block.title}</p>
              <p className="text-sm text-gray-700 leading-relaxed flex-1">{block.text}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
