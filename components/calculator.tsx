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
import { Truck } from 'lucide-react'

export function Calculator({ initialProductId }: { initialProductId?: string }) {
  const [selectedProduct, setSelectedProduct] = useState<string>(initialProductId || '')
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [volume, setVolume] = useState<string>('')
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiDeliveryPrice, setApiDeliveryPrice] = useState<number | null>(null)
  const [apiWarning, setApiWarning] = useState<string | null>(null)

  const calculation = useMemo(() => {
    if (!selectedProduct || !volume || parseFloat(volume) <= 0) {
      return null
    }

    const product = products.find(p => p.slug === selectedProduct)
    if (!product) return null

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
              {products.map((product) => (
                <SelectItem key={product.slug} value={product.slug}>
                  {product.name} — {product.pricePerTon.toLocaleString('ru-RU')} ₽/т
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
                <span>Итого:</span>
                <span>{calculation.total.toLocaleString('ru-RU')} ₽</span>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                ~{Math.round(calculation.pricePerTon).toLocaleString('ru-RU')} ₽/тонна с доставкой
              </p>
              {apiWarning && (
                <p className="text-sm text-amber-600 text-center">{apiWarning}</p>
              )}
            </div>

            {/* Бейдж "Доставка рассчитана через Деловые Линии" */}
            {selectedRegion && selectedRegion !== 'pickup' && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Badge variant="outline" className="gap-1.5">
                  <Truck className="h-3 w-3" />
                  Доставка рассчитана через Деловые Линии
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
                <p>• Цена продукта: {products.find(p => p.slug === selectedProduct)?.pricePerTon.toLocaleString('ru-RU')} ₽/т × {calculation.volumeNum} т</p>
                {calculation.deliveryInfo && (
                  <>
                    <p>• Регион: {calculation.deliveryInfo}</p>
                    <p>• Стоимость доставки включает все расходы на транспортировку</p>
                    <p>• ✓ Доставка рассчитана с учетом текущих тарифов</p>
                  </>
                )}
              </div>
            )}
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
