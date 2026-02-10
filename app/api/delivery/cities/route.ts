import { NextResponse } from 'next/server'

interface City {
  code: string
  name: string
  region: string
  hasTerminal: boolean
}

export async function GET() {
  try {
    // Попытка получить актуальный список из API Деловых Линий
    const response = await fetch('https://api.dellin.ru/v3/public/cities.json', {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Fallback: статический список основных городов
    return NextResponse.json(getFallbackCities())

  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(getFallbackCities())
  }
}

function getFallbackCities(): City[] {
  return [
    { code: 'ekaterinburg', name: 'Екатеринбург', region: 'Свердловская область', hasTerminal: true },
    { code: 'sverdlovsk', name: 'Свердловская область', region: 'Урал', hasTerminal: true },
    { code: 'moscow', name: 'Москва', region: 'Центральный ФО', hasTerminal: true },
    { code: 'spb', name: 'Санкт-Петербург', region: 'Северо-Западный ФО', hasTerminal: true },
    { code: 'kaliningrad', name: 'Калининград', region: 'Северо-Западный ФО', hasTerminal: true },
    { code: 'volga', name: 'Приволжье', region: 'Приволжский ФО', hasTerminal: true },
    { code: 'south', name: 'Юг России', region: 'Южный ФО', hasTerminal: true },
    { code: 'ural', name: 'Урал', region: 'Уральский ФО', hasTerminal: true },
    { code: 'west-siberia', name: 'Западная Сибирь', region: 'Сибирский ФО', hasTerminal: true },
    { code: 'east-siberia', name: 'Восточная Сибирь', region: 'Сибирский ФО', hasTerminal: true },
    { code: 'far-east', name: 'Дальний Восток', region: 'Дальневосточный ФО', hasTerminal: true },
    { code: 'central', name: 'Центральная Россия', region: 'Центральный ФО', hasTerminal: true }
  ]
}
