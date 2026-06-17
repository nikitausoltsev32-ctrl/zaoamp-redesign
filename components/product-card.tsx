'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { PriceTag } from './price-tag'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'
import { getProductImageAlt } from '@/lib/seo/metadata'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const hasPrice = product.pricePerTon !== undefined && product.pricePerTon !== null
  if (variant === 'compact') {
    return (
      <Card className="h-full transition-shadow hover:shadow-lg overflow-hidden group">
        {product.image && (
          <Link href={`/product/${product.slug}`} className="block relative h-44 overflow-hidden">
            <Image
              src={product.image}
              alt={getProductImageAlt(product)}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
            />
          </Link>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Badge variant="secondary" className="mb-2">
              {product.fraction}
            </Badge>
            <PriceTag price={product.pricePerTon} size="sm" />
          </div>
          <CardTitle className="text-lg">{product.name}</CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <Button asChild size="sm" className="w-full">
            <Link href={`/product/${product.slug}`} onClick={() => ymGoal('product_view')}>Подробнее</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
      <Card className="h-full transition-shadow hover:shadow-lg overflow-hidden group">
        {product.image && (
          <Link href={`/product/${product.slug}`} className="block relative h-52 overflow-hidden">
            <Image
              src={product.image}
              alt={getProductImageAlt(product)}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-brand-ice-blue/90">{product.fraction}</Badge>
            </div>
          </Link>
        )}
      <CardHeader className={product.image ? 'pt-4' : ''}>
        <div className="flex items-start justify-between gap-2">
          {!product.image && <Badge variant="secondary">{product.fraction}</Badge>}
          <PriceTag price={product.pricePerTon} />
        </div>
        <CardTitle className="font-serif text-xl mt-2">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Применение:</p>
          <div className="flex flex-wrap gap-1">
            {product.applications.slice(0, 3).map((app, idx) => {
              const words = app.split(' ')
              const label = words.length > 2 ? words.slice(0, 2).join(' ') + '…' : app
              return (
                <Badge key={idx} variant="outline" className="text-xs">
                  {label}
                </Badge>
              )
            })}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Белизна:</span> {product.specifications.whiteness}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="default" className="flex-1">
          <Link href={`/product/${product.slug}`} onClick={() => ymGoal('product_view')}>Подробнее</Link>
        </Button>
        {!hasPrice && (
          <Button asChild variant="outline" className="flex-1">
            <a href={`tel:${contactInfo.whatsapp}`} onClick={() => ymGoal('phone_click')}>
              <Phone className="mr-2 h-4 w-4" />
              Узнать цену
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
