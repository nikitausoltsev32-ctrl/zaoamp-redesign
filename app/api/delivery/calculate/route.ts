import { NextRequest, NextResponse } from 'next/server'

// Типы для API Деловых Линий
interface DellinCalculatorRequest {
  derivalCity: string
  arrivalCity: string
  weight: number // в тоннах
}

interface DellinCalculatorResponse {
  price: number
  deliveryDays: string
  error?: string
}

// Маппинг городов на коды Деловых Линий
const CITY_CODES: Record<string, string> = {
  'ekaterinburg': '7700000000000000000000000',
  'sverdlovsk': '6600000000000000000000000',
  'ural': '7400000000000000000000000',
  'volga': '1600000000000000000000000',
  'moscow': '7700000000000000000000000',
  'central': '5000000000000000000000000',
  'spb': '7800000000000000000000000',
  'kaliningrad': '3900000000000000000000000',
  'south': '6100000000000000000000000',
  'west-siberia': '5400000000000000000000000',
  'east-siberia': '2400000000000000000000000',
  'far-east': '2700000000000000000000000',
}

// Базовые тарифы (реальные, БЕЗ наценки)
const BASE_RATES: Record<string, number> = {
  'ekaterinburg': 1500,
  'sverdlovsk': 2000,
  'ural': 2500,
  'volga': 4500,
  'moscow': 6000,
  'central': 5000,
  'spb': 6500,
  'kaliningrad': 8500,
  'south': 6500,
  'west-siberia': 8000,
  'east-siberia': 10000,
  'far-east': 13000,
}

// Скрытая наценка 10%
const MARKUP = 1.10

export async function POST(request: NextRequest) {
  try {
    const { derivalCity, arrivalCity, weight }: DellinCalculatorRequest = await request.json()

    // Валидация
    if (!arrivalCity || !weight) {
      return NextResponse.json(
        { error: 'Не указаны обязательные параметры' },
        { status: 400 }
      )
    }

    // Получаем базовый тариф
    const baseRate = BASE_RATES[arrivalCity] || BASE_RATES['ural']

    // ВАЖНО: Применяем скрытую наценку 10%
    const pricePerTon = Math.round(baseRate * MARKUP)
    const totalPrice = Math.round(pricePerTon * weight)

    // Расчет примерных сроков доставки
    const deliveryDays = calculateDeliveryDays(arrivalCity)

    // TODO: В будущем можно добавить реальный запрос к API Деловых Линий
    // const dlResponse = await fetch('https://api.dellin.ru/v2/calculator.json', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     appkey: process.env.DELLIN_API_KEY,
    //     delivery: {
    //       deliveryType: { type: 'auto' },
    //       derival: { cityID: CITY_CODES[derivalCity] },
    //       arrival: { cityID: CITY_CODES[arrivalCity] }
    //     },
    //     cargo: {
    //       weight: weight * 1000, // в кг
    //     }
    //   })
    // })

    return NextResponse.json({
      price: totalPrice,
      pricePerTon: pricePerTon,
      deliveryDays,
      baseRate, // Для отладки (удалить в проде)
      markup: '10%' // Для отладки (удалить в проде)
    })

  } catch (error) {
    console.error('Delivery calculation error:', error)
    return NextResponse.json(
      { error: 'Ошибка расчета доставки' },
      { status: 500 }
    )
  }
}

function calculateDeliveryDays(region: string): string {
  const daysMap: Record<string, string> = {
    'ekaterinburg': '1-2',
    'sverdlovsk': '2-3',
    'ural': '3-5',
    'volga': '5-7',
    'moscow': '7-10',
    'central': '6-9',
    'spb': '7-10',
    'kaliningrad': '10-14',
    'south': '7-10',
    'west-siberia': '10-14',
    'east-siberia': '14-21',
    'far-east': '21-30',
  }
  return daysMap[region] || '5-7'
}
