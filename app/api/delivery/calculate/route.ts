import { NextRequest, NextResponse } from 'next/server'
import type { DeliveryCalculationRequest, TruckLoad } from '@/types/delivery'
import { MAX_TRUCK_WEIGHT, MARKUP_PERCENTAGE } from '@/types/delivery'

// Текстовые адреса для address.search (документация: нужен текст "регион, город")
const ARRIVAL_ADDRESSES: Record<string, string> = {
  'ekaterinburg': 'Свердловская обл., Екатеринбург', 'sverdlovsk': 'Свердловская обл., Екатеринбург',
  'ural': 'Челябинская обл., Челябинск', 'volga': 'Республика Татарстан, Казань',
  'moscow': 'Москва', 'center': 'Тульская обл., Тула', 'central': 'Тульская обл., Тула',
  'northwest': 'Санкт-Петербург', 'spb': 'Санкт-Петербург',
  'kaliningrad': 'Калининградская обл., Калининград', 'south': 'Ростовская обл., Ростов-на-Дону',
  'siberia-west': 'Новосибирская обл., Новосибирск', 'west-siberia': 'Новосибирская обл., Новосибирск',
  'siberia-east': 'Красноярский край, Красноярск', 'east-siberia': 'Красноярский край, Красноярск',
  'far-east': 'Приморский край, Владивосток',
}

// Базовые тарифы (реальные, БЕЗ наценки)
// Алиасы для городов из GET /api/delivery/cities
const BASE_RATES: Record<string, number> = {
  'ekaterinburg': 1500, 'sverdlovsk': 2000, 'ural': 2500, 'volga': 4500,
  'moscow': 6000, 'center': 5000, 'central': 5000, 'northwest': 6500, 'spb': 6500,
  'kaliningrad': 8500, 'south': 6500,
  'siberia-west': 8000, 'west-siberia': 8000,
  'siberia-east': 10000, 'east-siberia': 10000,
  'far-east': 13000,
}

const MARKUP = 1 + MARKUP_PERCENTAGE / 100

/** Разбить вес на грузовики по 20 т: 25т → [20, 5], 45т → [20, 20, 5] */
function splitWeightIntoTrunks(totalWeight: number): number[] {
  if (totalWeight <= MAX_TRUCK_WEIGHT) return [totalWeight]
  const loads: number[] = []
  let remaining = totalWeight
  while (remaining > 0) {
    loads.push(Math.min(remaining, MAX_TRUCK_WEIGHT))
    remaining -= MAX_TRUCK_WEIGHT
  }
  return loads
}

export async function POST(request: NextRequest) {
  // #region agent log
  const log = (msg: string, data?: any) => {
    fetch('http://127.0.0.1:7244/ingest/ec2db2f5-3e83-41ce-8a21-5674a6d22505', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'app/api/delivery/calculate/route.ts',
        message: msg,
        data: data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  };
  // #endregion

  try {
    const body = await request.json()
    // #region agent log
    log('Incoming request', { body, apiKeyExists: !!process.env.DELLIN_API_KEY });
    // #endregion
    const { derivalCity, arrivalCity, weight, volume } = body as DeliveryCalculationRequest

    // Валидация
    if (!arrivalCity || !weight) {
      // #region agent log
      log('Validation failed', { arrivalCity, weight });
      // #endregion
      return NextResponse.json(
        { error: 'Не указаны обязательные параметры' },
        { status: 400 }
      )
    }

    const loads = splitWeightIntoTrunks(Number(weight))
    const splitByTrucks = loads.length > 1
    const arrivalAddress = ARRIVAL_ADDRESSES[arrivalCity]
    const derivalLabel = 'Екатеринбург (терминал 14)'
    const arrivalLabel = arrivalAddress || arrivalCity
    const totalVol = volume ?? Math.max(Number(weight) * 0.7, 0.1)

    console.log(`[Калькулятор] Маршрут: ${derivalLabel} → ${arrivalLabel} | ${weight} т${splitByTrucks ? ` (${loads.length} машин)` : ''}`)

    const trucks: TruckLoad[] = []
    let totalPrice = 0
    let deliveryDays = calculateDeliveryDays(arrivalCity)

    const baseRate = BASE_RATES[arrivalCity] || BASE_RATES['ural']

    const calcOneTruck = async (w: number): Promise<{ price: number; deliveryDays: string }> => {
      const wKg = w * 1000
      const vol = Math.max(w * 0.7, 0.1)
      if (process.env.DELLIN_API_KEY && arrivalAddress) {
        try {
          const produceDate = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
          const req = {
            appkey: process.env.DELLIN_API_KEY,
            delivery: {
              deliveryType: { type: 'auto' },
              derival: { produceDate, variant: 'terminal', terminalID: '14' },
              arrival: {
                variant: 'address',
                address: { search: arrivalAddress },
                time: { worktimeStart: '09:00', worktimeEnd: '18:00' },
              },
            },
            cargo: {
              quantity: 1, length: 1, width: 1, height: 1,
              totalVolume: vol, totalWeight: wKg, weight: wKg,
              oversizedWeight: wKg >= 800 ? wKg : 0,
              oversizedVolume: wKg >= 800 ? vol : 0,
            },
          }
          const res = await fetch('https://api.dellin.ru/v2/calculator.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
          })
          const text = await res.text()
          let data: { errors?: Array<{ code?: number; title?: string; detail?: string; fields?: string[] }>; data?: { price?: string | number; deliveryTerm?: number } } | null = null
          try { data = JSON.parse(text) } catch { data = null }
          const codes = data?.errors?.map((e) => e.code).join(', ') || '—'
          console.log(`[Dellin API] HTTP ${res.status} | Коды: ${codes} | Груз: ${w}т`)
          if (!res.ok && data?.errors?.length) {
            data.errors.forEach((e) => console.log(`  [${e.code}] ${e.title}: ${e.detail} (${e.fields?.join(', ') ?? ''})`))
          }
          if (res.ok && data && !data.errors?.length) {
            const p = data?.data?.price
            if (p != null && p !== 'null') {
              const num = typeof p === 'string' ? parseFloat(p) : p
              const price = Math.round(num * MARKUP)
              const days = data?.data?.deliveryTerm != null ? `${data.data.deliveryTerm} дн.` : calculateDeliveryDays(arrivalCity)
              return { price, deliveryDays: days }
            }
          }
        } catch (e) {
          console.warn('Dellin API failed for truck:', e)
        }
      }
      const price = Math.round(baseRate * MARKUP * w)
      return { price, deliveryDays: calculateDeliveryDays(arrivalCity) }
    }

    for (let i = 0; i < loads.length; i++) {
      const { price, deliveryDays: days } = await calcOneTruck(loads[i])
      totalPrice += price
      if (i === 0) deliveryDays = days
      trucks.push({
        number: i + 1,
        weight: loads[i],
        volume: loads[i] * 0.7,
        price,
        pricePerTon: loads[i] > 0 ? Math.round(price / loads[i]) : 0,
        deliveryDays: days,
      })
    }

    const totalBasePrice = Math.round(totalPrice / MARKUP)
    const averageDeliveryDays = deliveryDays

    return NextResponse.json({
      totalWeight: Number(weight),
      totalVolume: totalVol,
      trucksCount: trucks.length,
      trucks,
      totalPrice,
      price: totalPrice,
      totalBasePrice,
      averageDeliveryDays,
      splitByTrucks,
      warning: splitByTrucks ? `Груз разделен на ${trucks.length} грузовика (макс. ${MAX_TRUCK_WEIGHT}т каждый)` : undefined,
      source: process.env.DELLIN_API_KEY && arrivalAddress ? 'dellin_api' : 'static_rates',
      markup: `${MARKUP_PERCENTAGE}%`,
    })

  } catch (error) {
    console.error('Delivery calculation error:', error)
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/ec2db2f5-3e83-41ce-8a21-5674a6d22505', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'app/api/delivery/calculate/route.ts',
        message: 'Top level catch error',
        data: { error: String(error) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return NextResponse.json(
      { error: 'Ошибка расчета доставки' },
      { status: 500 }
    )
  }
}

function calculateDeliveryDays(region: string): string {
  const daysMap: Record<string, string> = {
    'ekaterinburg': '1-2', 'sverdlovsk': '2-3', 'ural': '3-5', 'volga': '5-7',
    'moscow': '7-10', 'center': '6-9', 'central': '6-9',
    'northwest': '7-10', 'spb': '7-10', 'kaliningrad': '10-14', 'south': '7-10',
    'siberia-west': '10-14', 'west-siberia': '10-14',
    'siberia-east': '14-21', 'east-siberia': '14-21',
    'far-east': '21-30',
  }
  return daysMap[region] || '5-7'
}
