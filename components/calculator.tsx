'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { products } from '@/lib/data/products'
import { deliveryRegions } from '@/lib/data/calculator'
import { ymGoal } from '@/lib/analytics'
import { getUTMData } from '@/lib/hooks/use-utm'

export function Calculator({ initialProductId }: { initialProductId?: string }) {
  const initialProduct = useMemo(
    () => products.find((product) => product.id === initialProductId || product.slug === initialProductId),
    [initialProductId]
  )
  const [selectedProduct, setSelectedProduct] = useState(initialProduct?.slug ?? '')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [volume, setVolume] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const product = products.find((item) => item.slug === selectedProduct)
    const region = deliveryRegions.find((item) => item.id === selectedRegion)
    if (!product || !volume || !selectedRegion || !leadPhone.trim()) return

    setLeadStatus('loading')
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: leadPhone.trim(),
          source: 'price_request',
          productName: product.name,
          productSlug: product.slug,
          quantityTons: Number(volume),
          region: region?.name ?? selectedRegion,
          utm: getUTMData(),
        }),
      })
      if (!response.ok) throw new Error('Lead request failed')
      ymGoal('calculator_lead_submit')
      setLeadStatus('sent')
    } catch {
      setLeadStatus('error')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Запрос стоимости</CardTitle>
      </CardHeader>
      <CardContent>
        {leadStatus === 'sent' ? (
          <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-green-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="font-medium">Запрос отправлен</p>
              <p className="text-sm">Менеджер рассчитает цену партии и доставки и свяжется с вами.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="product">Продукт</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Выберите продукт" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.slug} value={product.slug}>
                      {product.name} — по запросу
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="volume">Объём, тонн</Label>
                <Input
                  id="volume"
                  type="number"
                  min="1"
                  step="0.1"
                  placeholder="Например, 20"
                  value={volume}
                  onChange={(event) => setVolume(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Регион доставки</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion} required>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Выберите регион" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryRegions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote-phone">Телефон</Label>
              <Input
                id="quote-phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={leadPhone}
                onChange={(event) => setLeadPhone(event.target.value)}
                required
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Цена рассчитывается индивидуально с учётом фракции, объёма, упаковки и доставки.
            </p>

            <Button
              type="submit"
              disabled={leadStatus === 'loading'}
              className="w-full bg-brand-sapphire hover:bg-brand-sapphire-dark"
            >
              <Send className="mr-2 h-4 w-4" />
              {leadStatus === 'loading' ? 'Отправка...' : 'Получить расчёт'}
            </Button>
            {leadStatus === 'error' && (
              <p className="text-sm text-red-600">Не удалось отправить запрос. Попробуйте ещё раз.</p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}
