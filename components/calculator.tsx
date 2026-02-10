'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { products } from '@/lib/data/products'
import { deliveryRegions, calculatePrice, getDisplayDeliveryPrice, CalculatorResult } from '@/lib/data/calculator'
import { formatPrice } from '@/lib/utils/products'
import { Calculator, Truck, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CalculatorProps {
  initialProductId?: string
}

export function CalculatorComponent({ initialProductId }: CalculatorProps) {
  const [productId, setProductId] = useState(initialProductId || products[0].id)
  const [volume, setVolume] = useState('20')
  const [regionId, setRegionId] = useState('ekaterinburg')
  const [showDetails, setShowDetails] = useState(false)

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === productId) || products[0],
    [productId]
  )

  const selectedRegion = useMemo(() => 
    deliveryRegions.find(r => r.id === regionId) || deliveryRegions[0],
    [regionId]
  )

  const result: CalculatorResult | null = useMemo(() => {
    const vol = parseFloat(volume) || 0
    if (vol <= 0) return null
    return calculatePrice(selectedProduct.pricePerTon, vol, regionId)
  }, [selectedProduct, volume, regionId])

  const volumeError = useMemo(() => {
    const vol = parseFloat(volume) || 0
    if (vol > 0 && vol < selectedRegion.minVolume && regionId !== 'pickup') {
      return `Минимальный заказ для доставки: ${selectedRegion.minVolume} тонн`
    }
    return null
  }, [volume, selectedRegion, regionId])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-brand-orange/10 to-brand-gold/10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="h-5 w-5 text-brand-orange" />
          Рассчитать стоимость
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Product Selection */}
        <div className="space-y-2">
          <Label htmlFor="product">Фракция</Label>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger id="product">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} — {formatPrice(product.pricePerTon)} ₽/т
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Volume Input */}
        <div className="space-y-2">
          <Label htmlFor="volume">Объем (тонн)</Label>
          <div className="relative">
            <Input
              id="volume"
              type="number"
              min="1"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className={volumeError ? 'border-red-500' : ''}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              тонн
            </span>
          </div>
          {volumeError && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {volumeError}
            </div>
          )}
          {regionId !== 'pickup' && (
            <p className="text-xs text-muted-foreground">
              Минимальный заказ для доставки: {selectedRegion.minVolume} тонн
            </p>
          )}
        </div>

        {/* Region Selection */}
        <div className="space-y-2">
          <Label htmlFor="region" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Регион доставки
          </Label>
          <Select value={regionId} onValueChange={setRegionId}>
            <SelectTrigger id="region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {deliveryRegions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                  {region.id !== 'pickup' && (
                    <span className="ml-2 text-muted-foreground">
                      (от {formatPrice(getDisplayDeliveryPrice(region.id))} ₽/т)
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {selectedRegion.description}
          </p>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-stone-50 rounded-xl p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Стоимость продукта:</span>
                <span className="font-medium">{formatPrice(result.productCost)} ₽</span>
              </div>
              
              {result.deliveryCost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Доставка ({result.regionName}):</span>
                  <span className="font-medium">{formatPrice(result.deliveryCost)} ₽</span>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Итого:</span>
                  <span className="text-2xl font-bold text-brand-orange">
                    {formatPrice(result.total)} ₽
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-right mt-1">
                  ~{formatPrice(Math.round(result.total / result.volume))} ₽/тонна с доставкой
                </p>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full"
              >
                {showDetails ? 'Скрыть детали' : 'Показать детали расчета'}
              </Button>

              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-muted-foreground space-y-1 pt-2 border-t"
                >
                  <p>Цена продукта: {formatPrice(result.pricePerTon)} ₽/т × {result.volume} т</p>
                  {result.deliveryCost > 0 && (
                    <>
                      <p>Регион: {result.regionName}</p>
                      <p>Тариф доставки: {formatPrice(getDisplayDeliveryPrice(regionId))} ₽/т (без НДС)</p>
                      <p className="text-green-600">
                        ✓ В стоимость включены все расходы на транспортировку
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {result && (
          <Button className="w-full bg-brand-orange hover:bg-brand-gold" size="lg">
            Оставить заявку на {result.volume} тонн
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
