'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, Bot, CheckCircle2, ExternalLink, Lightbulb, Loader2, MessageCircle, Package, Phone, Send, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ymGoal } from '@/lib/analytics'

type StructuredBlock = {
  solution?: string | null
  recommendation?: string | null
  nextStep?: string | null
  handoff?: string | null
  internetNote?: string | null
}

type AssistantSource = {
  title: string
  url: string
  provider: string
}

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  structured?: StructuredBlock
  sources?: AssistantSource[]
}

type AssistantResponse = {
  sessionId: string
  reply: string
  structured?: StructuredBlock | null
  saved: boolean
  provider: string
  sources?: AssistantSource[]
  lead?: {
    phone?: string
  }
  error?: string
}

function StructuredBlocks({ structured }: { structured: StructuredBlock }) {
  const hasAny = structured.solution || structured.recommendation || structured.nextStep || structured.handoff
  if (!hasAny) return null

  return (
    <div className="mt-2 space-y-1.5">
      {structured.solution && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs">
          <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <div>
            <span className="font-semibold text-emerald-800">Решение: </span>
            <span className="text-emerald-700">{structured.solution}</span>
          </div>
        </div>
      )}
      {structured.recommendation && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
          <div>
            <span className="font-semibold text-blue-800">Рекомендация: </span>
            <span className="text-blue-700">{structured.recommendation}</span>
          </div>
        </div>
      )}
      {structured.internetNote && (
        <div className="flex items-start gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs">
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
          <div>
            <span className="font-semibold text-violet-800">Интернет: </span>
            <span className="text-violet-700">{structured.internetNote}</span>
          </div>
        </div>
      )}
      {structured.nextStep && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <div>
            <span className="font-semibold text-amber-800">Следующий шаг: </span>
            <span className="text-amber-700">{structured.nextStep}</span>
          </div>
        </div>
      )}
      {structured.handoff && (
        <div className="flex items-start gap-2 rounded-lg bg-brand-deep-navy px-3 py-2 text-xs text-white">
          <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/80" />
          <span>{structured.handoff}</span>
        </div>
      )}
    </div>
  )
}

function SourceLinks({ sources }: { sources?: AssistantSource[] }) {
  if (!sources?.length) return null

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {sources.slice(0, 3).map((source) => (
        <a
          key={source.url}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex max-w-full items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] text-stone-600 transition hover:border-brand-sapphire hover:text-brand-sapphire"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="truncate">{source.title || source.provider}</span>
        </a>
      ))}
    </div>
  )
}

const STARTER_MESSAGES = [
  'Подберите фракцию для декоративной штукатурки',
  'Какая фракция подойдет для ландшафта?',
  'Нужна мраморная крошка с доставкой',
  'Сколько стоит 20 тонн с доставкой?',
  'Какая упаковка доступна?',
  'Какие документы идут с отгрузкой?',
  'Есть ли фракции 5-10 и 10-20 мм?',
  'Хочу получить КП на 20 тонн',
]

const PHONE_CTA_MESSAGE = 'Хочу оставить телефон для расчета и консультации'

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `ai-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function AiAssistantWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Привет! Я Алекс, AI-менеджер АМП. Подберу фракцию из нашего каталога, объясню по цене/упаковке/документам и, если нужно, сверю внешний источник или страницу по ссылке. Что планируете сделать?',
      structured: {
        nextStep: 'Напишите задачу, город и примерный объем - я сразу назову подходящий вариант и что нужно для точного КП.',
      },
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const storedSessionId = window.localStorage.getItem('amp-ai-session-id')
    const nextSessionId = storedSessionId || createSessionId()
    window.localStorage.setItem('amp-ai-session-id', nextSessionId)
    setSessionId(nextSessionId)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, open])

  const sendMessage = async (text: string) => {
    const content = text.trim()
    if (!content || loading) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)
    ymGoal('ai_message_send')

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: nextMessages,
          pagePath: window.location.pathname,
        }),
      })
      const data = await response.json() as AssistantResponse

      if (!response.ok) {
        throw new Error(data.error || 'AI-менеджер временно недоступен')
      }

      setSessionId(data.sessionId)
      window.localStorage.setItem('amp-ai-session-id', data.sessionId)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: data.reply,
          structured: data.structured ?? undefined,
          sources: data.sources ?? undefined,
        },
      ])

      if (data.lead?.phone) {
        ymGoal('ai_lead_submit')
      }
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Не удалось отправить сообщение')
      setMessages((current) => current.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(input)
  }

  const handleOpen = () => {
    setOpen(true)
    ymGoal('ai_chat_open')
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open ? (
        <div className="flex h-[560px] max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-white/60 bg-white shadow-2xl md:max-w-md">
          <div className="flex items-center justify-between bg-brand-deep-navy px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-sapphire shadow-lg shadow-brand-sapphire/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">AI-менеджер АМП</p>
                <p className="flex items-center gap-1 text-xs text-white/75">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Каталог, заявки и web-контекст
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть AI-менеджера"
              className="rounded-md p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50 px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === 'user' ? 'flex justify-end' : 'flex items-end gap-2'}
              >
                {message.role === 'assistant' && (
                  <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-brand-sapphire shadow-sm ring-1 ring-stone-200">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={
                    message.role === 'user'
                      ? 'max-w-[85%] rounded-2xl rounded-br-md bg-brand-sapphire px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm'
                      : 'max-w-[85%] rounded-2xl rounded-bl-md border border-stone-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-stone-900 shadow-sm'
                  }
                >
                  <span className="whitespace-pre-wrap">{message.content}</span>
                  {message.role === 'assistant' && message.structured && (
                    <StructuredBlocks structured={message.structured} />
                  )}
                  {message.role === 'assistant' && <SourceLinks sources={message.sources} />}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2">
                <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-brand-sapphire shadow-sm ring-1 ring-stone-200">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-600 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Проверяю каталог, заявки и источники
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-white p-3">
            <div className="mb-3 rounded-lg border border-brand-sapphire/15 bg-brand-sapphire/5 p-3">
              <div className="mb-2 flex items-start gap-2 text-xs text-stone-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-sapphire" />
                <span>Для точного расчета лучше указать город, объем, задачу и нужную упаковку.</span>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => void sendMessage(PHONE_CTA_MESSAGE)}
                className="inline-flex items-center gap-2 rounded-md bg-brand-deep-navy px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-sapphire disabled:opacity-50"
              >
                <Phone className="h-3.5 w-3.5" />
                Оставить телефон менеджеру
              </button>
            </div>

            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {STARTER_MESSAGES.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  disabled={loading}
                  onClick={() => void sendMessage(starter)}
                  className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-left text-xs text-stone-700 transition hover:border-brand-sapphire hover:bg-brand-sapphire/5 hover:text-brand-sapphire disabled:opacity-50"
                >
                  {starter}
                </button>
              ))}
            </div>

            {error && (
              <p className="mb-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Напишите задачу или объем"
                disabled={loading}
                className="h-11 rounded-xl"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Отправить сообщение"
                className="h-11 w-11 shrink-0 rounded-xl bg-brand-sapphire p-0 hover:bg-brand-sapphire-dark"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Открыть AI-менеджера"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-sapphire text-white shadow-xl shadow-brand-sapphire/30 transition hover:bg-brand-sapphire-dark active:scale-95"
        >
          <span className="absolute inset-0 rounded-full bg-brand-sapphire/40 opacity-75 motion-safe:animate-ping" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange ring-2 ring-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
