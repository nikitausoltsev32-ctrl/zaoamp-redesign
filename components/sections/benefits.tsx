'use client'

import { benefits } from '@/lib/data/benefits'
import { BenefitCard } from '@/components/benefit-card'

export function BenefitsSection() {
  const getBentoClass = (index: number) => {
    // Асимметричная сетка (Bento Grid) для 8 элементов
    const spans = [
      'md:col-span-2 lg:col-span-2', // 0: Широкая (2 колонки)
      'md:col-span-1 lg:col-span-1', // 1: Обычная
      'md:col-span-1 lg:col-span-1', // 2: Обычная
      'md:col-span-1 lg:col-span-1', // 3: Обычная
      'md:col-span-1 lg:col-span-1', // 4: Обычная
      'md:col-span-1 lg:col-span-1', // 5: Обычная
      'md:col-span-2 lg:col-span-2', // 6: Широкая
      'md:col-span-2 lg:col-span-3', // 7: На всю ширину (3 колонки)
    ]
    return spans[index] || 'col-span-1'
  }

  return (
    <section id="benefits" className="py-20 bg-stone-50 overflow-hidden relative">
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-[0.03] bg-repeat mix-blend-multiply pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground mb-6">
            Почему выбирают <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-sapphire to-blue-500">нас</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            8 причин работать напрямую с производителем. Мы гарантируем стабильное качество и честные цены без наценок посредников.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={benefit.id} 
              benefit={benefit} 
              index={index} 
              className={getBentoClass(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
