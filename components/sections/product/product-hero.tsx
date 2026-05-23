'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Check, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Product } from '@/types'
import { PriceTag } from '@/components/price-tag'
import { getCategoryLabel } from '@/lib/utils/products'
import { getProductImageAlt } from '@/lib/seo/metadata'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'
import { getUTMData } from '@/lib/hooks/use-utm'

interface ProductHeroProps {
  product: Product
  categoryBreadcrumb?: {
    slug: string
    label: string
  }
}

export function ProductHero({ product, categoryBreadcrumb }: ProductHeroProps) {
  const categoryLabel = getCategoryLabel(product.category)
  const [quantity, setQuantity] = useState(1)
  const [packaging, setPackaging] = useState(product.specifications.packaging[0] ?? 'Навалом')
  const [phone, setPhone] = useState('')
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'sent'>('idle')
  const [orderError, setOrderError] = useState<string | null>(null)
  const subtotal = typeof product.pricePerTon === 'number'
    ? Math.max(1, quantity) * product.pricePerTon
    : undefined

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!phone.trim() || !subtotal) return
    setOrderStatus('loading')
    setOrderError(null)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          source: 'product_order',
          productName: product.name,
          productSlug: product.slug,
          quantityTons: Math.max(1, quantity),
          packaging,
          subtotal,
          utm: getUTMData(),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Ошибка отправки')
      ymGoal('product_order_submit')
      setOrderStatus('sent')
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Ошибка отправки')
      setOrderStatus('idle')
    }
  }

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
              <form
                onSubmit={submitOrder}
                className="mb-8 rounded-xl border bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-gray-900">Оформить заказ на товар</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Цена указана за товар без доставки. Логистику подтвердит менеджер.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr]">
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Тонн</span>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={quantity}
                      onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                      disabled={orderStatus === 'loading' || orderStatus === 'sent'}
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Упаковка</span>
                    <select
                      value={packaging}
                      onChange={(event) => setPackaging(event.target.value)}
                      disabled={orderStatus === 'loading' || orderStatus === 'sent'}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background"
                    >
                      {product.specifications.packaging.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mt-3 block space-y-1 text-sm">
                  <span className="text-muted-foreground">Телефон для подтверждения</span>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    disabled={orderStatus === 'loading' || orderStatus === 'sent'}
                  />
                </label>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Товар без доставки: </span>
                    <span className="font-semibold text-brand-sapphire">
                      {subtotal?.toLocaleString('ru-RU')} ₽
                    </span>
                  </p>
                  <Button
                    type="submit"
                    disabled={orderStatus === 'loading' || orderStatus === 'sent'}
                    className="bg-brand-sapphire hover:bg-brand-sapphire-dark"
                  >
                    {orderStatus === 'sent'
                      ? 'Заявка отправлена'
                      : orderStatus === 'loading'
                        ? 'Отправка...'
                        : 'Заказать'}
                  </Button>
                </div>
                {orderError && (
                  <p className="mt-3 text-sm text-red-600">{orderError}</p>
                )}
              </form>
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand-sapphire hover:bg-brand-sapphire-dark">
                <a
                  href={`tel:${contactInfo.whatsapp}`}
                  onClick={() => ymGoal('phone_click')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Позвонить {contactInfo.phone}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
              >
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => ymGoal('whatsapp_click')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Написать в WhatsApp
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Ответим за 5 минут в рабочее время · WhatsApp 24/7
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
