'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    text: 'Берём крошку фракции 2-5 и 5-10 мм уже второй сезон. Белизна стабильная от партии к партии, документы всегда в порядке. Важно, что поставщик работает по договору и закрывает сделку нормальными актами.',
    author: 'Руководитель отдела снабжения',
    role: 'Компания по благоустройству территорий',
    location: 'Екатеринбург',
  },
  {
    text: 'Микрокальцит используем как наполнитель в рецептуре скрабов. Дисперсность стабильная, CaCO₃ 98% подтверждено паспортом. Пробовали нескольких поставщиков — у АМП лучшее соотношение качества и цены.',
    author: 'Технолог производства',
    role: 'Косметическое предприятие',
    location: 'Беларусь',
  },
  {
    text: 'Заказываем щебень для декоративного бетона и ЖБИ. Кубовидная форма зерна — видно сразу, лещадность низкая. Доставка в Казахстан — без проблем, оформили всё нужное.',
    author: 'Прораб',
    role: 'Строительная компания',
    location: 'Казахстан',
  },
  {
    text: 'Используем мраморную муку в производстве сухих смесей. Белизна 98% критична для нашей продукции — не подводит. Работаем с АМП уже три года, есть рамочный договор.',
    author: 'Менеджер по закупкам',
    role: 'Производитель сухих строительных смесей',
    location: 'Москва',
  },
  {
    text: 'Крошка идёт на посыпку дорожек в коттеджных посёлках. Клиенты довольны — материал не темнеет, не пылит. Отгрузка в биг-бэгах удобна: разгрузил манипулятором и сразу в работу.',
    author: 'Владелец',
    role: 'Компания ландшафтного дизайна',
    location: 'Тюмень',
  },
  {
    text: 'Добавляем микрокальцит в комбикорма как источник кальция для птицы. Документы на безопасность есть, цена ниже чем у перекупщиков. Поставки регулярные — нареканий нет.',
    author: 'Специалист по кормам',
    role: 'Агропромышленный холдинг',
    location: 'Челябинская область',
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
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Нам доверяют производства и строительные компании
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Поставляем продукцию по всей России, в Беларусь и Казахстан.
            Конфиденциальность клиентов соблюдаем.
          </p>
        </div>

        {/* География */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {GEOGRAPHIES.map((geo) => (
            <div
              key={geo.label}
              className="bg-white rounded-xl border border-stone-200 px-5 py-4 flex gap-3 items-start"
            >
              <div className="h-8 w-8 shrink-0 rounded-full bg-brand-sapphire/10 flex items-center justify-center text-brand-sapphire font-bold text-xs mt-0.5">
                {geo.label.slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{geo.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{geo.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Отзывы */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col gap-4"
            >
              <Quote className="h-5 w-5 text-brand-sapphire/40 shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed flex-1">{t.text}</p>
              <div className="pt-3 border-t border-stone-100">
                <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
                <p className="text-xs text-brand-sapphire mt-0.5">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
