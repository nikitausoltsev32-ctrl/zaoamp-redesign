'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { products } from '@/lib/data/products'

const heroImages = products
  .filter(p => p.image)
  .map(p => ({
    src: p.image!,
    alt: p.name,
    fraction: p.fraction
  }))

export function HeroImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000) // Меняем каждые 4 секунды

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            fill
            className="object-cover grayscale-[20%] sepia-[15%]"
            priority
          />
          {/* Overlay с информацией о фракции */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-lg font-medium"
            >
              {heroImages[currentIndex].alt}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm"
            >
              Фракция: {heroImages[currentIndex].fraction}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Индикаторы */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-brand-orange w-6' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Бейджи поверх фото */}
      <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 z-10">
        <p className="text-2xl font-bold text-brand-orange">98%</p>
        <p className="text-xs text-muted-foreground">Белизна</p>
      </div>
      <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 z-10">
        <p className="text-2xl font-bold text-gray-900">50 000+</p>
        <p className="text-xs text-muted-foreground">Тонн отгружено</p>
      </div>
    </div>
  )
}
