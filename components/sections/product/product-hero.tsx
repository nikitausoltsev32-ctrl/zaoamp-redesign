'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'
import { PriceTag } from '@/components/price-tag'
import { getCategoryLabel } from '@/lib/utils/products'

interface ProductHeroProps {
  product: Product
}

export function ProductHero({ product }: ProductHeroProps) {
  const categoryLabel = getCategoryLabel(product.category)

  return (
    <section className="py-8 bg-white border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/catalog" className="hover:text-foreground transition-colors">
            Каталог
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover grayscale-[20%] sepia-[15%]"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <span className="text-5xl font-serif text-stone-400">М</span>
                  </div>
                  <p className="text-muted-foreground">{product.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-4">
              {categoryLabel}
            </Badge>
            
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <PriceTag price={product.pricePerTon} size="lg" />
              <p className="text-sm text-muted-foreground mt-1">
                Цена за тонну при заказе от 20 тонн
              </p>
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-stone-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Белизна</p>
                <p className="font-semibold">{product.specifications.whiteness}</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Упаковка</p>
                <p className="font-semibold">{product.specifications.packaging[0]}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-gold">
                <Link href="#calculator">
                  Рассчитать стоимость
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+79193931992">
                  Позвонить
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>В наличии</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>Доставка от 1 дня</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>Сертификаты</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
