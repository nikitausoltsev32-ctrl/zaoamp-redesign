import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { PriceTag } from './price-tag'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  if (variant === 'compact') {
    return (
      <Card className="h-full transition-shadow hover:shadow-lg overflow-hidden group">
        {product.image && (
          <div className="relative h-32 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover grayscale-[30%] sepia-[20%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
            />
          </div>
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
            <Link href={`/product/${product.slug}`}>Подробнее</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="h-full transition-shadow hover:shadow-lg overflow-hidden group">
      {product.image && (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover grayscale-[30%] sepia-[20%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-brand-ice-blue/90">{product.fraction}</Badge>
          </div>
        </div>
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
            {product.applications.slice(0, 3).map((app, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {app.split(' ').slice(0, 2).join(' ')}...
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Белизна:</span> {product.specifications.whiteness}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="default" className="flex-1">
          <Link href={`/product/${product.slug}`}>Подробнее</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/product/${product.slug}#calculator`}>Рассчитать</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
