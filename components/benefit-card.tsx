'use client'

import { useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Benefit } from '@/lib/data/benefits'

interface BenefitCardProps {
  benefit: Benefit
  index: number
  className?: string
}

export function BenefitCard({ benefit, index, className = '' }: BenefitCardProps) {
  const Icon = benefit.icon
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const ticking = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return

    const div = divRef.current
    const rect = div.getBoundingClientRect()

    // Synchronously store the latest position
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }

    // Throttle React state update using requestAnimationFrame
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setPosition(lastPos.current)
        ticking.current = false
      })
      ticking.current = true
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(1)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => {
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative h-full ${className}`}
    >
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full overflow-hidden rounded-2xl border border-stone-200/50 bg-white/50 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-sapphire/30"
      >
        {/* Glow effect tracking mouse */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            opacity,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(30, 64, 175, 0.1), transparent 40%)`, // brand-sapphire hex is roughly #1e40af or similar blue
          }}
        />

        <div className="relative z-10 flex h-full flex-col">
          {/* Animated Icon Container */}
          <motion.div 
            className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-sapphire/5 to-brand-sapphire/20 text-brand-sapphire transition-colors group-hover:from-brand-sapphire group-hover:to-brand-sapphire-light group-hover:text-white"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
               animate={{ 
                 y: [0, -3, 0],
               }}
               transition={{ 
                 duration: 2, 
                 repeat: Infinity, 
                 ease: "easeInOut",
                 delay: index * 0.2 // десинхронизация анимации
               }}
            >
              <Icon className="h-7 w-7" />
            </motion.div>
          </motion.div>

          <h3 className="mb-3 font-bold text-gray-900 md:text-lg">
            {benefit.title}
          </h3>
          <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
            {benefit.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
