'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'amp-cookie-consent'
const METRIKA_ID = 108746641

/**
 * Загрузка Яндекс.Метрики строго после согласия пользователя (152-ФЗ).
 * До нажатия «Принять» никакие трекеры не подключаются.
 */
function loadMetrika() {
  if (typeof window === 'undefined') return
  const w = window as any
  if (w.ym) return

  ;(function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
    m[i] =
      m[i] ||
      function () {
        ;(m[i].a = m[i].a || []).push(arguments)
      }
    m[i].l = 1 * (new Date() as any)
    for (let j = 0; j < e.scripts.length; j++) {
      if (e.scripts[j].src === r) return
    }
    k = e.createElement(t)
    a = e.getElementsByTagName(t)[0]
    k.async = 1
    k.src = r
    a.parentNode.insertBefore(k, a)
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID, 'ym')

  w.ym(METRIKA_ID, 'init', {
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true,
  })
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = window.localStorage.getItem(STORAGE_KEY)
    if (consent === 'accepted') {
      loadMetrika()
    } else if (consent !== 'declined') {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted')
    loadMetrika()
    setVisible(false)
  }

  const decline = () => {
    window.localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4">
      <div className="container mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-stone-700">
            Мы используем cookie и сервис Яндекс.Метрика для аналитики и улучшения
            работы сайта. Нажимая «Принять», вы соглашаетесь с обработкой данных
            согласно{' '}
            <Link
              href="/privacy"
              className="font-medium text-brand-sapphire underline hover:text-brand-sapphire-dark"
            >
              Политике обработки персональных данных
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={decline}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
            >
              Отклонить
            </button>
            <button
              type="button"
              onClick={accept}
              className="rounded-lg bg-brand-sapphire px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-sapphire-dark"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
