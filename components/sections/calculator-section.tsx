'use client'

import { SectionHeader } from '@/components/section-header'
import { Calculator } from '@/components/calculator'

export function CalculatorSection() {
  return (
    <section id="calculator" className="content-auto py-20 bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Запросите стоимость"
          subtitle="Рассчитаем цену партии и доставки под ваш объём"
          centered
        />
        <div className="mt-8">
          <Calculator />
        </div>
      </div>
    </section>
  )
}
