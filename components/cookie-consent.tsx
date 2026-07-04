'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'

const STORAGE_KEY = 'cookie_consent'
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

type Consent = 'accepted' | 'rejected' | null

function readConsent(): Consent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { value: Consent; ts: number }
    if (!parsed.ts || Date.now() - parsed.ts > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed.value
  } catch {
    return null
  }
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
  }, [])

  const choose = (value: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, ts: Date.now() }))
    } catch {}
    setConsent(value)
  }

  return (
    <>
      {consent === 'accepted' && (
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=108746641","ym");
              ym(108746641,"init",{webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});
            `,
          }}
        />
      )}
      {ready && consent === null && (
        <div className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4">
          <div className="mx-auto max-w-3xl rounded-xl border border-stone-200 bg-white shadow-lg p-4 sm:flex sm:items-center sm:gap-4">
            <p className="text-sm text-muted-foreground flex-1">
              Мы используем cookie и Яндекс.Метрику для анализа посещаемости.
              Данные обрабатываются согласно{' '}
              <Link href="/privacy/" className="underline hover:text-foreground">
                политике конфиденциальности
              </Link>
              .
            </p>
            <div className="flex gap-2 mt-3 sm:mt-0 shrink-0">
              <button
                onClick={() => choose('rejected')}
                className="px-4 py-2 text-sm rounded-lg border border-stone-300 text-muted-foreground hover:bg-stone-50 transition-colors"
              >
                Отклонить
              </button>
              <button
                onClick={() => choose('accepted')}
                className="px-4 py-2 text-sm rounded-lg bg-brand-sapphire text-white hover:opacity-90 transition-opacity"
              >
                Принять
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
