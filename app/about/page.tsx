'use client'

import Link from 'next/link'
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
    description: 'Вся продукция сертифицирована, соответствует ГОСТ и имеет паспорта качества'
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20">
              О компании
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              ЗАО «АМП ИМПОРТ-ЭКСПОРТ»
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Производитель белой мраморной крошки и щебня премиум-качества. 
              Собственное месторождение, доставка по всей России.
            </p>
            <Button asChild className="bg-brand-orange hover:bg-brand-gold">
              <Link href="/catalog">
                Перейти в каталог
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
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
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange mb-4">
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
            <div className="bg-gradient-to-br from-stone-200 to-stone-300 rounded-2xl aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <Mountain className="h-16 w-16 text-stone-400" />
                </div>
                <p className="text-stone-600 font-medium">Месторождение</p>
                <p className="text-stone-500 text-sm">Свердловская область</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
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
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-orange/10 text-brand-orange mb-4">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
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
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-brand-orange mb-2">6</div>
                <div className="text-sm text-muted-foreground">Фракций продукции</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-brand-orange mb-2">45 000</div>
                <div className="text-sm text-muted-foreground">Тонн/мес мощность</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-brand-orange mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Работаем без выходных</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
