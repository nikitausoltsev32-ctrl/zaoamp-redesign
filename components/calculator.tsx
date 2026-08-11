// ОБНОВЛЁННЫЙ КАЛЬКУЛЯТОР С ИНТЕГРАЦИЕЙ API ДЕЛОВЫХ ЛИНИЙ
// Заменит components/calculator.tsx

'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { products } from '@/lib/data/products'
import { deliveryRegions, calculatePrice, getDisplayDeliveryPrice } from '@/lib/data/calculator'
import { Badge } from '@/components/ui/badge'
import { Truck, Send, CheckCircle2 } from 'lucide-react'
import { ymGoal } from '@/lib/analytics'
import { getUTMData } from '@/lib/hooks/use-utm'

export function Calculator({ initialProductId }: { initialProductId?: string }) {
  const [selectedProduct, setSelectedProduct] = useState<string>(initialProductId || '')
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [volume, setVolume] = useState<string>('')
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiDeliveryPrice, setApiDeliveryPrice] = useState<number | null>(null)
  const [apiWarning, setApiWarning] = useState<string | null>(null)
  const [leadPhone, setLeadPhone] = useState('')
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const calculation = useMemo(() => {
    if (!selectedProduct || !volume || parseFloat(volume) <= 0) {
      return null
    }

    const product = products.find(p => p.slug === selectedProduct)
    if (!product || !product.pricePerTon) return null

    const volumeNum = parseFloat(volume)
    const productPrice = product.pricePerTon * volumeNum

    let deliveryPrice = 0
    let deliveryInfo = ''

    if (selectedRegion && selectedRegion !== 'pickup') {
      // Используем API цену если доступна
      if (apiDeliveryPrice) {
        deliveryPrice = apiDeliveryPrice
      } else {
        const result = calculatePrice(product.pricePerTon, volumeNum, selectedRegion)
        deliveryPrice = result ? result.deliveryCost : 0
      }
      const region = deliveryRegions.find(r => r.id === selectedRegion)
      deliveryInfo = region?.name || ''
    }

    const total = productPrice + deliveryPrice
    const pricePerTon = volumeNum > 0 ? total / volumeNum : 0

    return {
      productPrice,
      deliveryPrice,
      total,
      pricePerTon,
      volumeNum,
      productName: product.name,
      deliveryInfo,
    }
  }, [selectedProduct, selectedRegion, volume, apiDeliveryPrice])

  // Запрос к API Деловых Линий
  const handleCalculateWithAPI = async () => {
    if (!selectedRegion || selectedRegion === 'pickup' || !volume) {
      return
    }

    ymGoal('calculator_use')
    setLoading(true)
    try {
      const response = await fetch('/api/delivery/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          derivalCity: 'ekaterinburg',
          arrivalCity: selectedRegion,
          weight: parseFloat(volume)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setApiDeliveryPrice(data.price ?? data.totalPrice)
        setApiWarning(data.warning ?? null)
      }
    } catch (error) {
      console.error('API error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadPhone || !calculation) return
    setLeadStatus('loading')
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: leadPhone,
          source: 'calculator',
          productName: calculation.productName,
          quantityTons: calculation.volumeNum,
          region: calculation.deliveryInfo || 'Самовывоз',
          subtotal: calculation.productPrice,
          deliveryPrice: calculation.deliveryPrice,
          totalPrice: calculation.total,
          utm: getUTMData(),
        }),
      })
      if (!response.ok) throw new Error()
      ymGoal('calculator_lead_submit')
      setLeadStatus('sent')
    } catch (err) {
      setLeadStatus('error')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Калькулятор стоимости</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="product">Продукт</Label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите продукт" />
            </SelectTrigger>
            <SelectContent>
              {products.filter(p => p.pricePerTon).map((product) => (
                <SelectItem key={product.slug} value={product.slug}>
                  {product.name} — {product.pricePerTon!.toLocaleString('ru-RU')} ₽/т
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume">Объём (тонны)</Label>
          <Input
            id="volume"
            type="number"
            min="1"
            step="0.1"
            placeholder="Введите количество тонн"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Регион доставки</Label>
          <Select value={selectedRegion} onValueChange={(val) => {
            setSelectedRegion(val)
            setApiDeliveryPrice(null)
            setApiWarning(null)
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите регион" />
            </SelectTrigger>
            <SelectContent>
              {deliveryRegions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name} {region.id !== 'pickup' && `(от ${getDisplayDeliveryPrice(region.id).toLocaleString('ru-RU')} ₽/т)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRegion && selectedRegion !== 'pickup' && (
          <Button
            onClick={handleCalculateWithAPI}
            disabled={loading || !volume}
            variant="outline"
          >
            {loading ? 'Расчёт...' : 'Рассчитать точную стоимость доставки'}
          </Button>
        )}

        {calculation && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Стоимость продукта:</span>
                <span className="font-medium">
                  {calculation.productPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              {calculation.deliveryPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Доставка ({calculation.deliveryInfo}):
                  </span>
                  <span className="font-medium">
                    {calculation.deliveryPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Итого (приблизительно):</span>
                <span>~{calculation.total.toLocaleString('ru-RU')} ₽</span>
              </div>

              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-center">
                Приблизительная цена. Точная стоимость рассчитывается при оформлении заявки.
              </p>
              {apiWarning && (
                <p className="text-sm text-amber-600 text-center">{apiWarning}</p>
              )}
            </div>

            {/* Бейдж "Доставка рассчитана через Деловые Линии" */}
            {selectedRegion && selectedRegion !== 'pickup' && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                  <Truck className="h-3 w-3" />
                  Тариф Деловых Линий (приблизительно)
                </Badge>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? 'Скрыть детали' : 'Показать детали расчёта'}
            </Button>

            {showDetails && (
              <div className="space-y-1 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <p>• Цена продукта: {products.find(p => p.slug === selectedProduct)?.pricePerTon?.toLocaleString('ru-RU')} ₽/т × {calculation.volumeNum} т</p>
                {calculation.deliveryInfo && (
                  <>
                    <p>• Регион: {calculation.deliveryInfo}</p>
                    <p>• Стоимость доставки включает все расходы на транспортировку</p>
                    <p>• ✓ Доставка рассчитана с учетом текущих тарифов</p>
                  </>
                )}
              </div>
            )}

            {/* Lead capture form */}
            <div className="mt-6 pt-6 border-t border-stone-200">
              {leadStatus === 'sent' ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Расчёт отправлен!</p>
                    <p className="text-sm">Менеджер скоро свяжется с вами.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3 bg-brand-ice-blue/50 p-4 rounded-lg border border-brand-sapphire/20">
                  <div>
                    <p className="font-semibold text-foreground text-sm">Получить точный расчёт с учетом скидки на объём</p>
                    <p className="text-xs text-muted-foreground">Отправим коммерческое предложение на WhatsApp или Email</p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      aria-label="Номер телефона"
                      placeholder="+7 (___) ___-__-__"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={leadStatus === 'loading'}
                      className="bg-brand-sapphire hover:bg-brand-sapphire-dark"
                    >
                      {leadStatus === 'loading' ? 'Отправка...' : <><Send className="h-4 w-4 mr-2"/>Отправить</>}
                    </Button>
                  </div>
                  {leadStatus === 'error' && (
                    <p className="text-xs text-red-500">Ошибка отправки. Попробуйте ещё раз.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        )}

        {!calculation && volume && parseFloat(volume) > 0 && !selectedProduct && (
          <p className="text-sm text-muted-foreground text-center">
            Выберите продукт для расчёта стоимости
          </p>
        )}
      </CardContent>
    </Card>
  )
}
