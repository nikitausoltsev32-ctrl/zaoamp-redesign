'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Drill, Truck, Layers, Boxes } from 'lucide-react'

const features = [
  {
    icon: Drill,
    title: 'Буровзрывная добыча',
    description: 'Порода добывается буровзрывным методом на открытом карьере'
  },
  {
    icon: Truck,
    title: 'Hitachi и Hyundai',
    description: 'Погрузка экскаваторами Hitachi и Hyundai на самосвалы КАМАЗ 25 т'
  },
  {
    icon: Layers,
    title: 'Дробление и грохочение',
    description: 'Многоступенчатое дробление и разделение на фракции через грохоты'
  },
  {
    icon: Boxes,
    title: 'Упаковка и отгрузка',
    description: 'Биг-бэги 500 кг / 1 т или навал — готово к автоперевозке и ж/д'
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
            <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
              Производство
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Наш карьер
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Загляните на наше месторождение, где добывается уникальный белый мрамор 
              премиум-качества.
            </p>
          </motion.div>
        </div>

        {/* Images Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                  Месторождение в Челябинской области
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

        {/* Third Image - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative group mb-12 md:mb-16"
        >
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/quarry/quarry-3.jpg"
              alt="Мраморный карьер - огромные блоки мрамора"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white font-semibold text-lg">
                Белый мрамор высшего качества
              </p>
              <p className="text-white/80 text-sm">
                Природное сырье с месторождения
              </p>
            </div>
          </div>
        </motion.div>

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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-sapphire/10 text-brand-sapphire mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}
