'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export interface UTMData {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  /** Первый заход: внешний referrer и страница входа — видно органику без UTM */
  first_referrer?: string | null
  first_landing?: string | null
}

const UTM_STORAGE_KEY = 'zaoamp_utm_data'
const FIRST_TOUCH_KEY = 'zaoamp_first_touch'

function saveFirstTouch() {
  try {
    if (localStorage.getItem(FIRST_TOUCH_KEY)) return
    let referrer = ''
    if (document.referrer) {
      const host = new URL(document.referrer).hostname
      if (host !== window.location.hostname) referrer = document.referrer
    }
    localStorage.setItem(
      FIRST_TOUCH_KEY,
      JSON.stringify({ referrer, landing: window.location.pathname, timestamp: Date.now() })
    )
  } catch {
    // localStorage недоступен — источник просто не попадёт в заявку
  }
}

function readFirstTouch(): Pick<UTMData, 'first_referrer' | 'first_landing'> {
  try {
    const saved = localStorage.getItem(FIRST_TOUCH_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { first_referrer: parsed.referrer || null, first_landing: parsed.landing || null }
    }
  } catch {
    // ignore
  }
  return {}
}

export function useUTM() {
  const searchParams = useSearchParams()
  const [utmData, setUtmData] = useState<UTMData>({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
  })

  useEffect(() => {
    saveFirstTouch()

    // 1. Попытаться прочитать из URL
    const currentUtm: Partial<UTMData> = {}
    let hasNewUtm = false

    const params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    params.forEach((param) => {
      const val = searchParams.get(param)
      if (val) {
        currentUtm[param as keyof UTMData] = val
        hasNewUtm = true
      }
    })

    if (hasNewUtm) {
      // Сохраняем новые UTM в localStorage (живут 30 дней)
      const dataToSave = {
        ...currentUtm,
        timestamp: new Date().getTime(),
      }
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(dataToSave))
      setUtmData(currentUtm as UTMData)
    } else {
      // 2. Если в URL нет, читаем из localStorage
      try {
        const saved = localStorage.getItem(UTM_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          // Проверяем срок годности (30 дней)
          const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
          if (new Date().getTime() - parsed.timestamp < THIRTY_DAYS) {
            setUtmData({
              utm_source: parsed.utm_source || null,
              utm_medium: parsed.utm_medium || null,
              utm_campaign: parsed.utm_campaign || null,
              utm_content: parsed.utm_content || null,
              utm_term: parsed.utm_term || null,
            })
          } else {
            localStorage.removeItem(UTM_STORAGE_KEY)
          }
        }
      } catch (e) {
        console.error('Failed to parse UTM data from localStorage', e)
      }
    }
  }, [searchParams])

  return utmData
}

export function getUTMData(): UTMData {
  if (typeof window === 'undefined') {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null }
  }
  const firstTouch = readFirstTouch()
  try {
    const saved = localStorage.getItem(UTM_STORAGE_KEY)
    if (saved) {
      return { ...JSON.parse(saved), ...firstTouch }
    }
  } catch (e) {
    // ignore
  }
  return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null, ...firstTouch }
}
