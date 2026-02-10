'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator } from 'lucide-react'
import { HeroBackgroundSlider } from '@/components/hero-background-slider'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Фоновый слайдер с фото материала */}
      <HeroBackgroundSlider />
      
      {/* Контент поверх фона */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <Badge className="w-fit bg-brand-orange text-white hover:bg-brand-orange/90 border-0 text-sm px-4 py-1">
              Производитель №1 на Урале
            </Badge>
            
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              Мраморная крошка и щебень{' '}
              <span className="text-brand-orange">премиум-качества</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">
              Белизна до 98%. Доставка по всей России. От 2 900 ₽/тонна.
              Собственное месторождение белого мрамора.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-gold text-white border-0">
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
            
            {/* Преимущества */}
            <div className="flex flex-wrap gap-6 pt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              >
                <div className="h-10 w-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold">
                  98%
                </div>
                <div className="text-white">
                  <p className="font-semibold">Белизна</p>
                  <p className="text-sm text-white/70">Высший класс</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              >
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  45к
                </div>
                <div className="text-white">
                  <p className="font-semibold">тонн/мес</p>
                  <p className="text-sm text-white/70">Производство</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              >
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  300+
                </div>
                <div className="text-white">
                  <p className="font-semibold">Клиентов</p>
                  <p className="text-sm text-white/70">По всей России</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Стрелка вниз */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a 
          href="#benefits" 
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <span className="text-sm mb-2">Узнать больше</span>
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-current rounded-full"
            />
          </div>
        </a>
      </motion.div>
    </section>
  )
}
