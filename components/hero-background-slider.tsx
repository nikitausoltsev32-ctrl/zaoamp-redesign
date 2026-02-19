'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const backgroundImages = [
  { src: '/images/products/muka-0-0-2.jpg', alt: 'Мраморная мука' },
  { src: '/images/products/kroshka-0-5.jpg', alt: 'Мраморная крошка 0-5 мм' },
  { src: '/images/products/kroshka-5-10.jpg', alt: 'Мраморная крошка 5-10 мм' },
  { src: '/images/products/shheben-10-20.jpg', alt: 'Мраморный щебень 10-20 мм' },
  { src: '/images/products/shheben-20-50.jpg', alt: 'Мраморный щебень 20-50 мм' },
]

export function HeroBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 6500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ 
            opacity: 0,
            x: 100, // Въезжает справа
            scale: 1.1
          }}
          animate={{ 
            opacity: 1,
            x: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0,
            x: -100, // Уезжает влево
            scale: 0.95
          }}
          transition={{
            duration: 1.8,
            ease: [0.43, 0.13, 0.23, 0.96] // Кастомная кривая Безье для плавности
          }}
          className="absolute inset-0"
        >
          <Image
            src={backgroundImages[currentIndex].src}
            alt={backgroundImages[currentIndex].alt}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            quality={90}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Градиентные затемнения для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-[2]" />
      
      {/* Индикаторы слайдов */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-[3]">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'w-16 bg-brand-sapphire' 
                : 'w-12 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
