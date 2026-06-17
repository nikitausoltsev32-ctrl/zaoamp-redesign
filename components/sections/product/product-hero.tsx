'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Check, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'
import { PriceTag } from '@/components/price-tag'
import { getCategoryLabel } from '@/lib/utils/products'
import { getProductImageAlt } from '@/lib/seo/metadata'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'

interface ProductHeroProps {
  product: Product
  categoryBreadcrumb?: {
    slug: string
    label: string
  }
}

export function ProductHero({ product, categoryBreadcrumb }: ProductHeroProps) {
  const categoryLabel = getCategoryLabel(product.category)

  return (
    <section className="py-8 bg-brand-ice-blue border-b">
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
          {categoryBreadcrumb ? (
            <>
              <Link
                href={`/catalog/${categoryBreadcrumb.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {categoryBreadcrumb.label}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          ) : null}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={getProductImageAlt(product)}
                fill
                className="object-cover grayscale-[20%] sepia-[15%]"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-brand-ice-blue shadow-lg flex items-center justify-center">
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
                Точная цена зависит от объёма, упаковки и способа доставки
              </p>
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>

            {typeof product.pricePerTon === 'number' && (
              <div className="mb-8 rounded-xl border bg-white p-4 shadow-sm">
                <p className="font-semibold text-gray-900">Оформить заказ на товар</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Цена указана за товар без доставки. Объём, упаковку и логистику
                  рассчитает менеджер по телефону.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-4 w-full bg-brand-sapphire hover:bg-brand-sapphire-dark sm:w-auto"
                >
                  <a href={`tel:${contactInfo.whatsapp}`} onClick={() => ymGoal('phone_click')}>
                    <Phone className="mr-2 h-4 w-4" />
                    Заказать по телефону {contactInfo.phone}
                  </a>
                </Button>
              </div>
            )}

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
            <div className="flex">
              <Button asChild size="lg" className="bg-brand-sapphire hover:bg-brand-sapphire-dark">
                <a
                  href={`tel:${contactInfo.whatsapp}`}
                  onClick={() => ymGoal('phone_click')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Позвонить {contactInfo.phone}
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Ответим на все вопросы в рабочее время: {contactInfo.workingHours}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>Опт от 1 тонны</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>Авто и ж/д отгрузка по СНГ</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>Паспорта качества</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
