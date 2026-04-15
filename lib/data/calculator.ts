export interface DeliveryRegion {
  id: string
  name: string
  basePrice: number
  minCost: number
  minVolume: number
  description: string
}

export const deliveryRegions: DeliveryRegion[] = [
  {
    id: 'ekaterinburg',
    name: 'Екатеринбург',
    basePrice: 1650,
    minCost: 3300,
    minVolume: 20,
    description: 'Доставка по городу и ближайшие районы'
  },
  {
    id: 'sverdlovsk',
    name: 'Челябинская область',
    basePrice: 2200,
    minCost: 4400,
    minVolume: 20,
    description: 'Нижний Тагил, Первоуральск, Серов и др.'
  },
  {
    id: 'ural',
    name: 'Уральский регион',
    basePrice: 2750,
    minCost: 5500,
    minVolume: 20,
    description: 'Челябинск, Тюмень, Пермь, Курган, Уфа'
  },
  {
    id: 'volga',
    name: 'Поволжье',
    basePrice: 4950,
    minCost: 9900,
    minVolume: 20,
    description: 'Казань, Самара, Нижний Новгород, Саратов, Волгоград'
  },
  {
    id: 'moscow',
    name: 'Москва и Московская область',
    basePrice: 6600,
    minCost: 13200,
    minVolume: 20,
    description: 'Москва, Подмосковье'
  },
  {
    id: 'center',
    name: 'Центральный регион',
    basePrice: 5500,
    minCost: 11000,
    minVolume: 20,
    description: 'Тула, Калуга, Рязань, Владимир, Ярославль, Иваново'
  },
  {
    id: 'northwest',
    name: 'Санкт-Петербург и Северо-Запад',
    basePrice: 7150,
    minCost: 14300,
    minVolume: 20,
    description: 'Санкт-Петербург, Ленинградская обл., Новгород, Псков, Вологда'
  },
  {
    id: 'kaliningrad',
    name: 'Калининград и область',
    basePrice: 9350,
    minCost: 18700,
    minVolume: 20,
    description: 'Калининград (особый регион, требуется транзит)'
  },
  {
    id: 'south',
    name: 'Юг России',
    basePrice: 7150,
    minCost: 14300,
    minVolume: 20,
    description: 'Ростов-на-Дону, Краснодар, Ставрополь, Волгоград, Астрахань'
  },
  {
    id: 'siberia-west',
    name: 'Западная Сибирь',
    basePrice: 8800,
    minCost: 17600,
    minVolume: 20,
    description: 'Новосибирск, Омск, Томск, Барнаул, Кемерово'
  },
  {
    id: 'siberia-east',
    name: 'Восточная Сибирь',
    basePrice: 11000,
    minCost: 22000,
    minVolume: 20,
    description: 'Красноярск, Иркутск, Улан-Удэ, Чита'
  },
  {
    id: 'far-east',
    name: 'Дальний Восток',
    basePrice: 14300,
    minCost: 28600,
    minVolume: 20,
    description: 'Владивосток, Хабаровск, Благовещенск, Якутск'
  },
  {
    id: 'pickup',
    name: 'Самовывоз',
    basePrice: 0,
    minCost: 0,
    minVolume: 1,
    description: 'Забрать с производства в Челябинской области'
  }
]

export interface CalculatorResult {
  productCost: number
  deliveryCost: number
  markupAmount: number
  total: number
  pricePerTon: number
  volume: number
  regionName: string
}

export function calculatePrice(pricePerTon: number, volume: number, regionId: string): CalculatorResult | null {
  const region = deliveryRegions.find(r => r.id === regionId)
  if (!region) throw new Error('Region not found')
  if (volume < region.minVolume) return null
  const productCost = pricePerTon * volume
  let deliveryCost = 0
  if (regionId !== 'pickup') {
    const calculatedDelivery = region.basePrice * volume
    deliveryCost = Math.max(calculatedDelivery, region.minCost)
  }
  const markupAmount = deliveryCost > 0 ? deliveryCost - (deliveryCost / 1.1) : 0
  const total = productCost + deliveryCost
  return { productCost, deliveryCost, markupAmount, total, pricePerTon, volume, regionName: region.name }
}

export function getDisplayDeliveryPrice(regionId: string): number {
  const region = deliveryRegions.find(r => r.id === regionId)
  if (!region || regionId === 'pickup') return 0
  return Math.round(region.basePrice / 1.1)
}

export function getDisplayMinCost(regionId: string): number {
  const region = deliveryRegions.find(r => r.id === regionId)
  if (!region || regionId === 'pickup') return 0
  return Math.round(region.minCost / 1.1)
}