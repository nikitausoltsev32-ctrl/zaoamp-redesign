'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export interface UTMData {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
}

const UTM_STORAGE_KEY = 'zaoamp_utm_data'

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
  try {
    const saved = localStorage.getItem(UTM_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    // ignore
  }
  return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null }
}
