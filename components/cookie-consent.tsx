'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from '@/components/ui/app-link'

const STORAGE_KEY = 'cookie_consent'
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

// Баннер информационный: Метрика грузится всем, баннер только уведомляет.
// Старые значения 'rejected' считаются как «уведомление показано».
function wasNotified(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { ts?: number }
    if (!parsed.ts || Date.now() - parsed.ts > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    setShowBanner(!wasNotified())
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: 'accepted', ts: Date.now() }))
    } catch {}
    setShowBanner(false)
  }

  return (
    <>
      {/* Метрика с вебвизором тяжёлая (в Lighthouse TBT +8 с), поэтому tag.js грузим
          по первому действию посетителя или через 8 с после load. Очередь ym() копится
          сразу, цели до загрузки не теряются. */}
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};
            window.ym.l=1*new Date();
            ym(108746641,"init",{webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});
            (function(){
              var done=false,ev=['scroll','pointerdown','keydown','touchstart','mousemove'];
              function load(){
                if(done)return;done=true;
                ev.forEach(function(n){removeEventListener(n,load)});
                var k=document.createElement('script');k.async=1;
                k.src='https://mc.yandex.ru/metrika/tag.js?id=108746641';
                document.head.appendChild(k);
              }
              ev.forEach(function(n){addEventListener(n,load,{once:true,passive:true})});
              function later(){setTimeout(load,8000)}
              if(document.readyState==='complete')later();else addEventListener('load',later,{once:true});
            })();
          `,
        }}
      />
      {showBanner && (
        <div className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4 pointer-events-none">
          <div className="pointer-events-auto mx-auto max-w-3xl rounded-xl border border-stone-200 bg-white shadow-lg p-4 sm:flex sm:items-center sm:gap-4">
            <p className="text-sm text-muted-foreground flex-1">
              Сайт использует cookie и Яндекс.Метрику для анализа посещаемости. Подробнее — в{' '}
              <Link href="/privacy/" className="underline hover:text-foreground">
                политике конфиденциальности
              </Link>
              .
            </p>
            <div className="flex gap-2 mt-3 sm:mt-0 shrink-0">
              <button
                onClick={dismiss}
                className="px-4 py-2 text-sm rounded-lg bg-brand-sapphire text-white hover:opacity-90 transition-opacity"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
