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
import { motion } from 'framer-motion'

const stats = [
  { number: '300+', label: 'Клиентов', icon: Users },
  { number: '50 000+', label: 'Тонн отгружено', icon: TrendingUp },
  { number: '45 000', label: 'Тонн/мес производство', icon: Factory },
  { number: '98%', label: 'Белизна мрамора', icon: Award },
]

const values = [
  {
    icon: Mountain,
    title: 'Собственное месторождение',
    description: 'Добыча ведется на месторождении в Свердловской области с запасами белого мрамора высшего качества'
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Вся продукция сертифицирована, соответствует ГОСТ и имеет паспорта качества',
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
  return (
    <div className="min-h-screen bg-brand-ice-blue">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
              О компании
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              ЗАО «АМП ИМПОРТ-ЭКСПОРТ»
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Производитель белой мраморной крошки и щебня премиум-качества. 
              Собственное месторождение, доставка по всей России.
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
              <motion.div
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
              </motion.div>
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
                  ЗАО «АМП ИМПОРТ-ЭКСПОРТ» — динамично развивающаяся компания, 
                  специализирующаяся на добыче и переработке белого мрамора.
                </p>
                <p>
                  Мы владеем собственным месторождением в Свердловской области, 
                  где добываем уникальный по своим характеристикам белый мрамор 
                  с белизной до 98%.
                </p>
                <p>
                  Современное производство позволяет выпускать до 45 000 тонн 
                  продукции в месяц, обеспечивая потребности клиентов по всей России.
                </p>
                <p>
                  За годы работы мы заслужили доверие более 300 клиентов и 
                  отгрузили более 50 000 тонн продукции.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <motion.div
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
                  <p className="text-white font-medium">Месторождение в Свердловской области</p>
                </div>
              </motion.div>
              <motion.div
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
              </motion.div>
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
                <motion.div
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
                </motion.div>
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
              Уникальное месторождение белого мрамора в Свердловской области. 
              Запасы высококачественного сырья на десятилетия вперед.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
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
            </motion.div>
            
            <motion.div
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/quarry/quarry-3.jpg"
                  alt="Мраморный карьер - огромные блоки мрамора"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold">Природное сырье</p>
                  <p className="text-white/80 text-sm">Огромные блоки белого мрамора высшего качества</p>
                </div>
              </div>
            </motion.div>
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
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Производство
            </h2>
            <p className="text-muted-foreground mb-8">
              Наше производство оснащено современным оборудованием для дробления, 
              фракционирования и упаковки мраморной крошки. Автоматизированная 
              линия обеспечивает точное соответствие фракциям и стабильное качество.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
                className="bg-brand-ice-blue p-6 rounded-xl shadow-sm"
              >
                <div className="text-2xl font-bold text-brand-sapphire mb-2">6</div>
                <div className="text-sm text-muted-foreground">Фракций продукции</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-brand-ice-blue p-6 rounded-xl shadow-sm"
              >
                <div className="text-2xl font-bold text-brand-sapphire mb-2">45 000</div>
                <div className="text-sm text-muted-foreground">Тонн/мес мощность</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-brand-ice-blue p-6 rounded-xl shadow-sm"
              >
                <div className="text-2xl font-bold text-brand-sapphire mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Работаем без выходных</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
