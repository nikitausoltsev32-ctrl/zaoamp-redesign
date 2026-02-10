'use client'

import { benefits } from '@/lib/data/benefits'
import { BenefitCard } from '@/components/benefit-card'
import { SectionHeader } from '@/components/section-header'

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Почему выбирают нас"
          subtitle="8 ключевых преимуществ работы с производителем №1 на Урале"
          centered
        />
        
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
