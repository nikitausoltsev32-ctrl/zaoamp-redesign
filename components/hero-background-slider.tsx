'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Все фото загружены сразу, меняем только opacity */}
      {backgroundImages.map((img, index) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            priority={index === 0}
            quality={85}
            sizes="100vw"
          />
        </div>
      ))}
      
      {/* Градиентные затемнения для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-[2]" />
      
      {/* Индикаторы слайдов */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-[3]">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-12 h-1 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'bg-brand-orange' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
