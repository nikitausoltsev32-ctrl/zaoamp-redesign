'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { m } from 'framer-motion'
import { ArrowRight, Calculator, Phone } from 'lucide-react'
import { HeroBackgroundSlider } from '@/components/hero-background-slider'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'

export function HeroSection() {
  const stats = [
    { value: '20+', label: 'лет на рынке', sub: 'с 2004 года' },
    { value: '98%', label: 'белизна', sub: 'высший класс' },
    { value: 'СНГ', label: 'РФ · Беларусь · Казахстан', sub: 'авто и ж/д отгрузка' },
    { value: '1000+', label: 'отгрузок выполнено', sub: 'за 20 лет работы' },
  ]

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <HeroBackgroundSlider />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Левая колонка — текст + форма */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-5"
          >
            <Badge className="w-fit bg-brand-sapphire text-white hover:bg-brand-sapphire-dark border-0 text-sm px-4 py-1">
              Собственное производство на Урале
            </Badge>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl drop-shadow-lg">
              Мраморная крошка и щебень{' '}
              <span className="text-brand-powder-blue">премиум-качества</span>
            </h1>

            <p className="text-lg text-white/90 drop-shadow-md">
              Белизна 98%. Доставка по всей России.{' '}
              <span className="font-bold text-white">От 2 000 ₽/тонна</span>.
              Собственное месторождение белого мрамора.
            </p>

            {/* Звонок менеджеру */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <p className="text-white font-semibold mb-1 text-base">
                Получить коммерческое предложение
              </p>
              <p className="text-white/70 text-sm mb-4">
                Позвоните — рассчитаем стоимость и подберём фракцию в день обращения.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-brand-sapphire hover:bg-brand-sapphire-dark text-white border-0 w-full sm:w-auto"
              >
                <a href={`tel:${contactInfo.whatsapp}`} onClick={() => ymGoal('phone_click')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Позвонить {contactInfo.phone}
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-brand-sapphire hover:bg-brand-sapphire-dark text-white border-0 px-8"
              >
                <Link href="/catalog">
                  Каталог продукции
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white"
              >
                <Link href="/#calculator">
                  <Calculator className="mr-2 h-4 w-4" />
                  Рассчитать стоимость
                </Link>
              </Button>
            </div>
          </m.div>

          {/* Правая колонка — трастовые метрики */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {stats.map((stat, i) => (
              <m.div
                key={stat.value}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-5 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 border border-white/10"
              >
                <div className={`h-16 w-16 shrink-0 rounded-2xl bg-brand-sapphire flex items-center justify-center text-center text-white font-bold leading-none whitespace-nowrap shadow-lg ${stat.value.length > 4 ? 'text-[17px]' : 'text-xl'}`}>
                  {stat.value}
                </div>
                <div className="text-white">
                  <p className="font-bold text-lg leading-tight">{stat.label}</p>
                  <p className="text-sm text-white/70 mt-0.5">{stat.sub}</p>
                </div>
              </m.div>
            ))}
          </m.div>

        </div>
      </div>
    </section>
  )
}
