'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Bot, CheckCircle2, ExternalLink, Lightbulb, Loader2, MessageCircle, Package, Phone, Send, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { contactInfo } from '@/lib/data/contacts'
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
        <a
          href={`tel:${contactInfo.whatsapp}`}
          onClick={() => ymGoal('phone_click')}
          className="flex items-start gap-2 rounded-lg bg-brand-deep-navy px-3 py-2 text-xs text-white transition-colors hover:bg-brand-sapphire"
        >
          <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/80" />
          <span>
            {structured.handoff}
            <span className="mt-0.5 block font-semibold underline underline-offset-2">{contactInfo.phone}</span>
          </span>
        </a>
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
          className="inline-flex max-w-full items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] text-muted-foreground transition hover:border-brand-sapphire hover:text-brand-sapphire"
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

const MIN_PHONE_DIGITS = 10

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
  const [phoneMode, setPhoneMode] = useState(false)
  const [phoneValue, setPhoneValue] = useState('')
  const [phoneError, setPhoneError] = useState('')
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

  const handlePhoneSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const digits = phoneValue.replace(/\D/g, '')
    if (digits.length < MIN_PHONE_DIGITS) {
      setPhoneError('Укажите номер полностью, например +7 900 123-45-67')
      return
    }
    setPhoneError('')
    setPhoneMode(false)
    setPhoneValue('')
    void sendMessage(`Мой телефон: ${phoneValue.trim()}. Перезвоните мне для расчета и КП.`)
  }

  const handleOpen = () => {
    setOpen(true)
    ymGoal('ai_chat_open')
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 flex h-[560px] max-h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl md:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-deep-navy to-brand-sapphire px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-md"
                >
                  <Bot className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold leading-tight tracking-wide">AI-менеджер АМП</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-white/80 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    На связи
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={`tel:${contactInfo.whatsapp}`}
                  onClick={() => ymGoal('phone_click')}
                  aria-label={`Позвонить: ${contactInfo.phone}`}
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <Phone className="h-5 w-5" />
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть AI-менеджера"
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-200">
              {messages.map((message, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  key={`${message.role}-${index}`}
                  className={message.role === 'user' ? 'flex justify-end' : 'flex items-end gap-2'}
                >
                  {message.role === 'assistant' && (
                    <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-sapphire to-blue-500 text-white shadow-md">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={
                      message.role === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-brand-sapphire to-blue-600 px-4 py-2.5 text-sm leading-relaxed text-white shadow-md'
                        : 'max-w-[85%] rounded-2xl rounded-bl-sm border border-stone-100 bg-white/90 px-4 py-2.5 text-sm leading-relaxed text-foreground shadow-sm backdrop-blur-md'
                    }
                  >
                    <span className="whitespace-pre-wrap">{message.content}</span>
                    {message.role === 'assistant' && message.structured && (
                      <StructuredBlocks structured={message.structured} />
                    )}
                    {message.role === 'assistant' && <SourceLinks sources={message.sources} />}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-sapphire to-blue-500 text-white shadow-md">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-stone-100 bg-white/90 px-4 py-2.5 text-sm text-muted-foreground shadow-sm backdrop-blur-md">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-sapphire" />
                    Печатает...
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input Area */}
            <div className="border-t border-stone-100 bg-white/80 p-3 backdrop-blur-xl">
              <div className="mb-3 rounded-xl border border-brand-sapphire/20 bg-brand-sapphire/5 p-3 transition-colors hover:bg-brand-sapphire/10">
                {phoneMode ? (
                  <form onSubmit={handlePhoneSubmit}>
                    <label htmlFor="ai-phone-input" className="mb-2 flex items-start gap-2 text-xs font-medium text-foreground">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-sapphire" />
                      <span>Оставьте номер — перезвоним с расчетом в рабочее время.</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="ai-phone-input"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        autoFocus
                        value={phoneValue}
                        onChange={(event) => setPhoneValue(event.target.value)}
                        placeholder="+7 (900) 123-45-67"
                        disabled={loading}
                        className="h-10 rounded-lg border-stone-200 bg-white text-sm focus-visible:ring-brand-sapphire"
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-10 shrink-0 rounded-lg bg-gradient-to-r from-brand-deep-navy to-brand-sapphire px-4 text-xs font-semibold text-white shadow-md"
                      >
                        Жду звонка
                      </Button>
                    </div>
                    {phoneError && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">{phoneError}</p>
                    )}
                  </form>
                ) : (
                  <>
                    <div className="mb-2 flex items-start gap-2 text-xs font-medium text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-sapphire" />
                      <span>Для точного расчета укажите город, объем и задачу.</span>
                    </div>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setPhoneMode(true)
                        ymGoal('ai_phone_form_open')
                      }}
                      className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-brand-deep-navy to-brand-sapphire px-3 py-2 text-xs font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Оставить телефон для КП
                    </button>
                  </>
                )}
              </div>

              <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {STARTER_MESSAGES.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    disabled={loading}
                    onClick={() => void sendMessage(starter)}
                    className="shrink-0 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-left text-xs font-medium text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-sapphire hover:bg-brand-sapphire/5 hover:text-brand-sapphire hover:shadow disabled:opacity-50"
                  >
                    {starter}
                  </button>
                ))}
              </div>

              {error && (
                <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 font-medium">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Задайте вопрос..."
                  disabled={loading}
                  className="h-12 rounded-xl border-stone-200 bg-white/80 shadow-inner focus-visible:ring-brand-sapphire"
                />
                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Отправить сообщение"
                  className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-brand-sapphire to-blue-600 p-0 text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:hover:scale-100"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleOpen}
            aria-label="Открыть AI-менеджера"
            className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-sapphire to-blue-600 text-white shadow-2xl shadow-brand-sapphire/40 outline-none ring-4 ring-white/50 transition-all hover:shadow-brand-sapphire/60"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-sapphire to-blue-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
            
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange ring-2 ring-white shadow-sm z-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </span>
            
            <MessageCircle className="relative z-10 h-7 w-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
