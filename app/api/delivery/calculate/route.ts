import { NextRequest, NextResponse } from 'next/server'

// Типы для API Деловых Линий
interface DellinCalculatorRequest {
  derivalCity: string
  arrivalCity: string
  weight: number // в тоннах
}

// Текстовые адреса для address.search (документация: нужен текст "регион, город")
const ARRIVAL_ADDRESSES: Record<string, string> = {
  'ekaterinburg': 'Свердловская обл., Екатеринбург',
  'sverdlovsk': 'Свердловская обл., Екатеринбург',
  'ural': 'Челябинская обл., Челябинск',
  'volga': 'Республика Татарстан, Казань',
  'moscow': 'Москва',
  'center': 'Тульская обл., Тула',
  'northwest': 'Санкт-Петербург',
  'kaliningrad': 'Калининградская обл., Калининград',
  'south': 'Ростовская обл., Ростов-на-Дону',
  'siberia-west': 'Новосибирская обл., Новосибирск',
  'siberia-east': 'Красноярский край, Красноярск',
  'far-east': 'Приморский край, Владивосток',
}

// Базовые тарифы (реальные, БЕЗ наценки)
// Ключи должны совпадать с ID из lib/data/calculator.ts
const BASE_RATES: Record<string, number> = {
  'ekaterinburg': 1500,
  'sverdlovsk': 2000,
  'ural': 2500,
  'volga': 4500,
  'moscow': 6000,
  'center': 5000,
  'northwest': 6500,
  'kaliningrad': 8500,
  'south': 6500,
  'siberia-west': 8000,
  'siberia-east': 10000,
  'far-east': 13000,
}

// Скрытая наценка 10%
const MARKUP = 1.10

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
    const { derivalCity, arrivalCity, weight } = body as DellinCalculatorRequest

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

    let pricePerTon = 0
    let totalPrice = 0
    let deliveryDays = calculateDeliveryDays(arrivalCity)
    let isApiUsed = false

    // Попытка использовать API Деловых Линий
    if (process.env.DELLIN_API_KEY) {
      try {
        const arrivalAddress = ARRIVAL_ADDRESSES[arrivalCity]
        log('Arrival address resolved', { arrivalAddress, arrivalCity })
        if (arrivalAddress) {
            // API Деловых Линий имеет ограничение 20 тонн
            if (weight > 20) {
                console.warn('Weight exceeds Dellin API limit (20t), using static rates');
                log('Weight exceeds limit', { weight, limit: 20 });
            } else {
                const weightKg = Number(weight) * 1000
                const totalVol = Math.max(Number(weight) * 0.7, 0.1) // ~0.7 м³/т для насыпного груза
                // Дата: +3 дня (документация — даты берут из «Подбор даты отправки», +3 уменьшает риск 180012)
                const produceDate = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
                const isOversized = weightKg >= 800
                // Вывод маршрута в консоль
                const derivalLabel = 'Екатеринбург (терминал 14)'
                const arrivalLabel = arrivalAddress
                console.log(`[Калькулятор] Маршрут: ${derivalLabel} → ${arrivalLabel} | ${weight} т`)

                const requestBody = {
                    appkey: process.env.DELLIN_API_KEY,
                    delivery: {
                        deliveryType: { type: 'auto' },
                        derival: {
                            produceDate,
                            variant: 'terminal',
                            terminalID: '14', // Терминал Екатеринбург
                        },
                        arrival: {
                            variant: 'address',
                            address: {
                                search: arrivalAddress, // Текст адреса (документация: search или street)
                            },
                            time: {
                                worktimeStart: '09:00',
                                worktimeEnd: '18:00',
                            },
                        },
                    },
                    cargo: {
                        quantity: 1,
                        length: 1,
                        width: 1,
                        height: 1,
                        totalVolume: totalVol,
                        totalWeight: weightKg,
                        weight: weightKg,
                        oversizedWeight: isOversized ? weightKg : 0,
                        oversizedVolume: isOversized ? totalVol : 0,
                    },
                }

                // #region agent log
                log('Sending request to Dellin API', { url: 'https://api.dellin.ru/v2/calculator.json', requestBody });
                // #endregion

                const dlResponse = await fetch('https://api.dellin.ru/v2/calculator.json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                })

                const responseText = await dlResponse.text()
                let dlData: { errors?: Array<{ code?: number; title?: string; detail?: string; fields?: string[] }>; data?: { price?: string | number; deliveryTerm?: number } } | null = null
                try {
                    dlData = JSON.parse(responseText)
                } catch {
                    dlData = null
                }

                // Вывод в терминал: HTTP-код и коды ошибок API
                const errorCodes = dlData?.errors?.map((e) => e.code).join(', ') || '—'
                console.log(`[Dellin API] HTTP ${dlResponse.status} | Коды ошибок: ${errorCodes}`)
                if (!dlResponse.ok && dlData?.errors?.length) {
                    dlData.errors.forEach((e) => {
                        console.log(`  [${e.code}] ${e.title}: ${e.detail} (${e.fields?.join(', ') || ''})`)
                    })
                }

                log('Dellin API response raw', { status: dlResponse.status, statusText: dlResponse.statusText, body: responseText })

                if (dlResponse.ok && dlData) {
                    // #region agent log
                    log('Dellin API response data', { dlData });
                    // #endregion
                    
                    // Проверяем наличие ошибок в ответе API (иногда 200 OK содержит errors)
                    if (dlData.errors && dlData.errors.length > 0) {
                        const codes = dlData.errors.map((e) => e.code).join(', ')
                        console.warn(`[Dellin API] HTTP ${dlResponse.status} — логические ошибки: ${codes}`, dlData.errors)
                        log('Dellin API logic errors', { errors: dlData.errors })
                    } else {
                        // Документация: итоговая стоимость в data.price
                        const apiPrice = dlData?.data?.price
                        if (apiPrice != null && apiPrice !== 'null') {
                            const priceNum = typeof apiPrice === 'string' ? parseFloat(apiPrice) : apiPrice
                            totalPrice = Math.round(priceNum * MARKUP)
                            pricePerTon = weight > 0 ? Math.round(totalPrice / weight) : 0
                            if (dlData?.data?.deliveryTerm != null) {
                                deliveryDays = `${dlData.data.deliveryTerm} дн.`
                            }
                            isApiUsed = true
                        }
                    }
                } else {
                    log('Dellin API failed status', { status: dlResponse.status })
                }
            }
        } else {
            console.warn(`No arrival address for region: ${arrivalCity}`)
            log('No arrival address', { arrivalCity })
        }
      } catch (apiError) {
        console.warn('Dellin API failed, falling back to static rates', apiError)
        // #region agent log
        log('Dellin API exception', { error: String(apiError) });
        // #endregion
      }
    } else {
        // #region agent log
        log('No API key provided, skipping API call');
        // #endregion
    }

    // Если API не сработал или ключ не задан, используем статические тарифы
    if (!isApiUsed) {
        // #region agent log
        log('Using static rates fallback');
        // #endregion
        // Получаем базовый тариф
        const baseRate = BASE_RATES[arrivalCity] || BASE_RATES['ural']

        // ВАЖНО: Применяем скрытую наценку 10%
        pricePerTon = Math.round(baseRate * MARKUP)
        totalPrice = Math.round(pricePerTon * weight)
    }

    return NextResponse.json({
      price: totalPrice,
      pricePerTon: pricePerTon,
      deliveryDays,
      source: isApiUsed ? 'dellin_api' : 'static_rates',
      markup: '10%' 
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
    'ekaterinburg': '1-2',
    'sverdlovsk': '2-3',
    'ural': '3-5',
    'volga': '5-7',
    'moscow': '7-10',
    'center': '6-9',
    'northwest': '7-10',
    'kaliningrad': '10-14',
    'south': '7-10',
    'siberia-west': '10-14',
    'siberia-east': '14-21',
    'far-east': '21-30',
  }
  return daysMap[region] || '5-7'
}
