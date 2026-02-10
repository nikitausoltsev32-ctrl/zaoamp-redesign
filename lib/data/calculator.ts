export interface DeliveryRegion {
  id: string
  name: string
  basePrice: number // Цена за тонну (с уже встроенной 10% наценкой)
  minCost: number // Минимальная стоимость доставки
  minVolume: number // Минимальный объем заказа
  description: string
}

// Цены указаны с учетом 10% скрытой наценки
// Формула: реальная_цена * 1.1 = basePrice
export const deliveryRegions: DeliveryRegion[] = [
  {
    id: 'ekaterinburg',
    name: 'Екатеринбург',
    basePrice: 1650, // 1500 * 1.1 = 1650 (10% наценка)
    minCost: 3300,   // 3000 * 1.1
    minVolume: 20,
    description: 'Доставка по городу и ближайшие районы'
  },
  {
    id: 'ural',
    name: 'Уральский регион',
    basePrice: 2750, // 2500 * 1.1
    minCost: 5500,   // 5000 * 1.1
    minVolume: 20,
    description: 'Челябинск, Тюмень, Пермь, Курган и др.'
  },
  {
    id: 'moscow',
    name: 'Москва и Центр',
    basePrice: 6600, // 6000 * 1.1
    minCost: 13200,  // 12000 * 1.1
    minVolume: 20,
    description: 'Москва, Санкт-Петербург, Центральный ФО'
  },
  {
    id: 'siberia',
    name: 'Сибирь и Дальний Восток',
    basePrice: 8800, // 8000 * 1.1
    minCost: 17600,  // 16000 * 1.1
    minVolume: 20,
    description: 'Новосибирск, Красноярск, Владивосток и др.'
  },
  {
    id: 'south',
    name: 'Юг России',
    basePrice: 7150, // 6500 * 1.1
    minCost: 14300,  // 13000 * 1.1
    minVolume: 20,
    description: 'Ростов, Краснодар, Волгоград и др.'
  },
  {
    id: 'pickup',
    name: 'Самовывоз',
    basePrice: 0,
    minCost: 0,
    minVolume: 1,
    description: 'Забрать с производства в Свердловской области'
  }
]

export interface CalculatorResult {
  productCost: number
  deliveryCost: number
  markupAmount: number // Скрытая наценка
  total: number
  pricePerTon: number
  volume: number
  regionName: string
}

export function calculatePrice(
  pricePerTon: number,
  volume: number,
  regionId: string
): CalculatorResult | null {
  const region = deliveryRegions.find(r => r.id === regionId)
  if (!region) {
    throw new Error('Region not found')
  }

  // Проверка минимального объема
  if (volume < region.minVolume) {
    return null
  }

  // Стоимость продукта
  const productCost = pricePerTon * volume

  // Расчет доставки
  let deliveryCost = 0
  if (regionId !== 'pickup') {
    const calculatedDelivery = region.basePrice * volume
    deliveryCost = Math.max(calculatedDelivery, region.minCost)
  }

  // Вычисляем скрытую наценку (10% от доставки)
  // deliveryCost уже включает наценку, поэтому:
  // markupAmount = deliveryCost - (deliveryCost / 1.1)
  const markupAmount = deliveryCost > 0 ? deliveryCost - (deliveryCost / 1.1) : 0

  // Итого
  const total = productCost + deliveryCost

  return {
    productCost,
    deliveryCost,
    markupAmount,
    total,
    pricePerTon,
    volume,
    regionName: region.name
  }
}

// Функция для отображения "чистой" цены доставки (без наценки)
export function getDisplayDeliveryPrice(regionId: string): number {
  const region = deliveryRegions.find(r => r.id === regionId)
  if (!region || regionId === 'pickup') return 0
  
  // Делим на 1.1 чтобы показать цену без наценки
  return Math.round(region.basePrice / 1.1)
}

// Функция для получения минимальной стоимости (без наценки)
export function getDisplayMinCost(regionId: string): number {
  const region = deliveryRegions.find(r => r.id === regionId)
  if (!region || regionId === 'pickup') return 0
  
  return Math.round(region.minCost / 1.1)
}
