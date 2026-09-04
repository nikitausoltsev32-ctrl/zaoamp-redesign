'use client'

import { Product } from '@/types'
import { SectionHeader } from '@/components/section-header'
import { Calculator } from '@/components/calculator'

interface ProductCalculatorProps {
  product: Product
}

export function ProductCalculator({ product }: ProductCalculatorProps) {
  return (
    <section id="calculator" className="py-16 bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Запросить стоимость"
          subtitle={`Рассчитаем цену ${product.name.toLowerCase()} и доставки под ваш объём`}
          centered
        />
        <div className="mt-8">
          <Calculator initialProductId={product.id} />
        </div>
      </div>
    </section>
  )
}
