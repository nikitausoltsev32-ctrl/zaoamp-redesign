'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mountain, 
  Award, 
  Users, 
  Factory, 
  TrendingUp, 
  Shield,
  ArrowRight
} from 'lucide-react'
import { m } from 'framer-motion'
import { generateBreadcrumbSchema, generateFAQSchema, JsonLd } from '@/lib/seo/schema'

const faqs = [
  {
    question: 'Откуда поставляется сырьё?',
    answer: 'Мы разрабатываем собственное месторождение белого мрамора в Челябинской области. Добыча ведётся буровзрывным методом, а переработка — на нашем дробильно-сортировочном комплексе. Вся цепочка под контролем одной компании.',
  },
  {
    question: 'Что значит «белизна 98%»?',
    answer: 'Это показатель отражающей способности материала по шкале Rd. Высокая белизна нашего мрамора обусловлена природной химической чистотой породы и низким содержанием примесей — это не результат отбеливания, а свойство сырья.',
  },
  {
    question: 'Какую форму имеет зерно?',
    answer: 'Кубовидную. Применяемая технология дробления обеспечивает получение фракционированного мраморного песка кубической формы. Такая форма даёт максимальную плотность укладки и лучший декоративный эффект по сравнению с лещадными зёрнами.',
  },
  {
    question: 'Какие документы вы предоставляете?',
    answer: 'Для доступных на сайте позиций опубликованы паспорта качества. Если нужен документ на конкретную номенклатуру или партию, уточните это при запросе.',
  },
  {
    question: 'Как осуществляется отгрузка?',
    answer: 'Навалом, в биг-бэгах 500 кг или 1 т. Доступна автомобильная и железнодорожная отгрузка по всей России с карьера и склада в Екатеринбурге.',
  },
]

const stats = [
  { number: '12', label: 'SKU в каталоге', icon: Users },
  { number: '3', label: 'Товарные группы', icon: TrendingUp },
  { number: 'Авто / ж/д', label: 'Форматы отгрузки', icon: Factory },
  { number: '98%', label: 'Белизна мрамора', icon: Award },
]

const values = [
  {
    icon: Mountain,
    title: 'Собственное месторождение',
    description: 'Добыча ведется на месторождении в Челябинской области с запасами белого мрамора высшего качества'
  },
  {
    icon: Shield,
    title: 'Документы на продукцию',
    description: 'Паспорта качества на доступные позиции размещены на сайте, остальные документы уточняйте при запросе',
    href: '/documents'
  },
  {
    icon: Factory,
    title: 'Современное производство',
    description: 'Автоматизированная линия фракционирования обеспечивает точное соответствие размерам'
  },
  {
    icon: Award,
    title: 'Премиум-качество',
    description: 'Белизна до 98%, содержание CaCO₃ ≥ 98%, кубовидная форма зерна'
  },
]

export default function AboutPage() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: '/' },
    { name: 'О компании', item: '/about' },
  ])

  return (
    <div className="min-h-screen bg-brand-ice-blue">
      <JsonLd data={breadcrumb} />
      <JsonLd data={generateFAQSchema(faqs)} />
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
              О компании
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              ЗАО «АМП ИМПОРТ-ЭКСПОРТ» — производитель мраморной крошки, щебня и микрокальцита
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Собственное месторождение белого мрамора в Челябинской области, офис и склад в Екатеринбурге.
              Импортное оборудование, кубовидная форма зерна, доставка по всей России.
            </p>
            <Button asChild className="bg-brand-sapphire hover:bg-brand-sapphire-dark">
              <Link href="/catalog">
                Перейти в каталог
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-brand-ice-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-sapphire/10 text-brand-sapphire mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                История компании
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  ЗАО «АМП ИМПОРТ-ЭКСПОРТ» занимается производством мраморных наполнителей различных
                  фракций. Применяемая нами технология обеспечивает получение фракционированного
                  мраморного песка кубовидной формы — именно такая форма зерна даёт максимальную
                  укладываемость и декоративный эффект.
                </p>
                <p>
                  Главный приоритет для нас — качество: химическая чистота продукта без примесей
                  и глинистых частиц, точность фракционирования и стабильность фракционного состава
                  от партии к партии.
                </p>
                <p>
                  Мы владеем собственной сырьевой базой — месторождением белого мрамора в
                  Челябинской области. Высокая белизна (до 98%) обусловлена химической чистотой
                  породы и низким содержанием примесей — это природное свойство нашего сырья.
                </p>
                <p>
                  В каталоге представлены крошка, щебень, мраморная мука и микрокальцит с
                  характеристиками по фракции, упаковке и применению. Поставки сопровождаем
                  от предварительного расчёта до отгрузки под ваш объект и регион.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <m.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl group"
              >
                <Image
                  src="/images/quarry/quarry-1.jpg"
                  alt="Мраморный карьер - добыча белого мрамора"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium">Месторождение в Челябинской области</p>
                </div>
              </m.div>
              <m.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl group"
              >
                <Image
                  src="/images/quarry/quarry-2.jpg"
                  alt="Мраморный карьер - масштаб производства"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium">Современная техника для добычи</p>
                </div>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-brand-ice-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Наши преимущества
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Почему клиенты выбирают нас
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const content = (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-sapphire/10 text-brand-sapphire mb-4">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </>
              )
              return (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`text-center ${'href' in value && value.href ? 'group' : ''}`}
                >
                  {'href' in value && value.href ? (
                    <Link
                      href={value.href}
                      className="block hover:opacity-90 transition-opacity"
                    >
                      {content}
                      <span className="text-xs text-brand-sapphire mt-2 inline-block group-hover:underline">
                        Скачать паспорта →
                      </span>
                    </Link>
                  ) : (
                    content
                  )}
                </m.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quarry Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
              Галерея
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Месторождение
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Уникальное месторождение белого мрамора в Челябинской области. 
              Запасы высококачественного сырья на десятилетия вперед.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/quarry/quarry-1.jpg"
                  alt="Мраморный карьер - панорама добычи"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold">Масштаб добычи</p>
                  <p className="text-white/80 text-sm">Профессиональная техника и огромные блоки мрамора</p>
                </div>
              </div>
            </m.div>
            
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/quarry/quarry-2.jpg"
                  alt="Мраморный карьер - рабочий процесс"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold">Процесс добычи</p>
                  <p className="text-white/80 text-sm">Современное оборудование для эффективной работы</p>
                </div>
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/quarry/quarry-3.jpg"
                  alt="Мраморный карьер - добыча сырья"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold">Природное сырье</p>
                  <p className="text-white/80 text-sm">Белый мрамор с месторождения</p>
                </div>
              </div>
            </m.div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-brand-sapphire" />
              <span>Белизна мрамора до 98% — уникальное качество для России</span>
            </div>
          </div>
        </div>
      </section>

      {/* Production */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Производство
              </h2>
              <p className="text-muted-foreground">
                Полный цикл: от добычи на собственном карьере до готовой фракции,
                упакованной в биг-бэги или отгруженной навалом.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10 text-left">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-sm font-semibold text-brand-sapphire mb-2">Этап 1 — Добыча</div>
                <h3 className="font-semibold text-gray-900 mb-2">Карьер в Челябинской области</h3>
                <p className="text-sm text-muted-foreground">
                  Добыча ведётся буровзрывным методом. Мраморная порода грузится экскаваторами
                  Hitachi и Hyundai на самосвалы КАМАЗ грузоподъёмностью 25 тонн. Карьер обеспечивает
                  бесперебойное снабжение сырьём дробильно-сортировочного комплекса.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-sm font-semibold text-brand-sapphire mb-2">Этап 2 — Переработка</div>
                <h3 className="font-semibold text-gray-900 mb-2">Дробление и фракционирование</h3>
                <p className="text-sm text-muted-foreground">
                  Исходная порода проходит дробление и последующее разделение на фракции с помощью
                  грохотов. Готовый щебень транспортируется конвейерами и складируется. В цикле
                  используется импортное оборудование и современные технологии.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
                className="bg-brand-ice-blue p-6 rounded-xl shadow-sm text-center"
              >
                <div className="text-2xl font-bold text-brand-sapphire mb-2">12</div>
                <div className="text-sm text-muted-foreground">Фракций продукции</div>
              </m.div>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-brand-ice-blue p-6 rounded-xl shadow-sm text-center"
              >
                <div className="text-2xl font-bold text-brand-sapphire mb-2">3</div>
                <div className="text-sm text-muted-foreground">Основные товарные группы</div>
              </m.div>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-brand-ice-blue p-6 rounded-xl shadow-sm text-center"
              >
                <div className="text-2xl font-bold text-brand-sapphire mb-2">Авто / ж/д</div>
                <div className="text-sm text-muted-foreground">Форматы отгрузки по России</div>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Частые вопросы о производстве
              </h2>
              <p className="text-muted-foreground">
                Коротко — о сырье, качестве и отгрузке
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <m.details
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-stone-50 rounded-xl p-5 cursor-pointer open:bg-brand-ice-blue/60"
                >
                  <summary className="font-semibold text-gray-900 list-none flex justify-between items-center gap-4">
                    <span>{faq.question}</span>
                    <ArrowRight className="h-4 w-4 text-brand-sapphire transition-transform group-open:rotate-90 shrink-0" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </m.details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
