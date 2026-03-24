'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Product } from '@/types'
import { PriceTag } from './price-tag'
import Link from 'next/link'
import { FileText } from 'lucide-react'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [kpOpen, setKpOpen] = useState(false)
  const [kpPhone, setKpPhone] = useState('')
  const [kpSubmitted, setKpSubmitted] = useState(false)
  const [kpLoading, setKpLoading] = useState(false)
  const [kpError, setKpError] = useState<string | null>(null)

  const handleKpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const phone = kpPhone.trim()
    if (!phone) return
    setKpLoading(true)
    setKpError(null)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, source: `product-${product.slug}` }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Ошибка отправки')
      setKpSubmitted(true)
    } catch (err) {
      setKpError(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setKpLoading(false)
    }
  }

  const hasPrice = product.pricePerTon !== undefined && product.pricePerTon !== null
  if (variant === 'compact') {
    return (
      <Card className="h-full transition-shadow hover:shadow-lg overflow-hidden group">
        {product.image && (
          <Link href={`/product/${product.slug}`} className="block relative h-44 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
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
            <Link href={`/product/${product.slug}`}>Подробнее</Link>
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
              alt={product.name}
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
          <Link href={`/product/${product.slug}`}>Подробнее</Link>
        </Button>
        {hasPrice ? (
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/product/${product.slug}#calculator`}>Рассчитать</Link>
          </Button>
        ) : (
          <Button variant="outline" className="flex-1" onClick={() => setKpOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Получить КП
          </Button>
        )}
      </CardFooter>

      <Dialog
        open={kpOpen}
        onOpenChange={(open) => {
          setKpOpen(open)
          if (!open) {
            setKpPhone('')
            setKpSubmitted(false)
            setKpError(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Получить КП на {product.name}</DialogTitle>
            <DialogDescription>
              Оставьте номер телефона и мы вам перезвоним
            </DialogDescription>
          </DialogHeader>
          {kpSubmitted ? (
            <p className="text-sm text-green-600 py-4">
              Спасибо! Мы перезвоним в ближайшее время.
            </p>
          ) : (
            <form onSubmit={handleKpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`kp-phone-${product.id}`}>Телефон</Label>
                <Input
                  id={`kp-phone-${product.id}`}
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={kpPhone}
                  onChange={(e) => setKpPhone(e.target.value)}
                  required
                  disabled={kpLoading}
                  className="w-full"
                />
              </div>
              {kpError && (
                <p className="text-sm text-destructive">{kpError}</p>
              )}
              <DialogFooter>
                <Button type="submit" disabled={kpLoading}>
                  {kpLoading ? 'Отправка...' : 'Отправить'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
