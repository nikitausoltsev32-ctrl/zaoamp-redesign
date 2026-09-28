'use client'

import dynamic from 'next/dynamic'

export const AiAssistantWidgetLazy = dynamic(
  () => import('./ai-assistant-widget').then((m) => m.AiAssistantWidget),
  { ssr: false },
)
