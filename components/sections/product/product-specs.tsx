import Link from 'next/link'
import { Product } from '@/types'
import { SectionHeader } from '@/components/section-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

interface ProductSpecsProps {
  product: Product
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const specs = [
    { label: 'Фракция', value: product.fraction },
    { label: 'Белизна', value: product.specifications.whiteness },
    { label: 'Насыпная плотность', value: product.specifications.density || '1400-1600 кг/м³' },
    { label: 'Форма зерна', value: 'Кубовидная' },
    { label: 'Морозостойкость', value: product.specifications.frostResistance || 'F300' },
    { label: 'Водопоглощение', value: product.specifications.waterAbsorption || '≤ 0.5%' },
    { label: 'Содержание CaCO₃', value: product.specifications.caco3 || '≥ 98%' },
    { label: 'Радиоактивность', value: product.specifications.radioactivity || 'Класс 1 (безопасный)' },
    { label: 'Упаковка', value: product.specifications.packaging.join(', ') },
  ]

  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Технические характеристики"
          subtitle="Полная информация о продукте"
          centered
        />

        <div className="mt-8 max-w-3xl mx-auto">
          <div className="bg-brand-ice-blue rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y">
              {specs.map((spec, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between items-center px-6 py-4 ${index % 2 === 0 ? 'bg-stone-50/50' : ''}`}
                >
                  <span className="font-medium text-gray-900">
                    {spec.label}
                  </span>
                  <span className="text-right">
                    {spec.label === 'Белизна' || spec.label === 'Содержание CaCO₃' ? (
                      <Badge variant="secondary" className="bg-brand-sapphire/10 text-brand-sapphire">
                        {spec.value}
                      </Badge>
                    ) : (
                      spec.value
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Паспорт качества */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/documents" className="gap-2">
                <FileText className="h-4 w-4" />
                Паспорта качества
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Сертификат и паспорт предоставляются при отгрузке
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
