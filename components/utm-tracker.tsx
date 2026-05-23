'use client'

import { Suspense } from 'react'
import { useUTM } from '@/lib/hooks/use-utm'

function UTMTrackerInner() {
  useUTM() // Хук сам читает URL и пишет в localStorage
  return null
}

export function UTMTracker() {
  return (
    <Suspense fallback={null}>
      <UTMTrackerInner />
    </Suspense>
  )
}
