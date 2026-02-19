'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Mountain, Factory, Award, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Mountain,
    title: 'Собственное месторождение',
    description: 'Добыча ведется на уникальном месторождении в Свердловской области'
  },
  {
    icon: Factory,
    title: 'Современная техника',
    description: 'Используем профессиональное оборудование для добычи мрамора'
  },
  {
    icon: Award,
    title: 'Белизна 98%',
    description: 'Уникальный белый мрамор высшего качества с запасами на десятилетия'
  },
  {
    icon: TrendingUp,
    title: '45 000 тонн/мес',
    description: 'Производственная мощность для любых объемов заказов'
  }
]

export function QuarrySection() {
  return (
    <section id="quarry" className="py-16 md:py-24 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20">
              Производство
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Наш карьер
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Загляните на наше месторождение, где добывается уникальный белый мрамор 
              премиум-качества. Масштаб производства впечатляет.
            </p>
          </motion.div>
        </div>

        {/* Images Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/quarry/quarry-1.jpg"
                alt="Мраморный карьер - вид на добычу"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-semibold text-lg">
                  Месторождение в Свердловской области
                </p>
                <p className="text-white/80 text-sm">
                  Добыча белого мрамора высшего качества
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/quarry/quarry-2.jpg"
                alt="Мраморный карьер - масштаб производства"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-semibold text-lg">
                  Профессиональная техника
                </p>
                <p className="text-white/80 text-sm">
                  Современное оборудование для добычи
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
                <Mountain className="h-4 w-4 text-brand-orange" />
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
                <Factory className="h-4 w-4 text-brand-gold" />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              Реальное производство • Проверьте сами
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
