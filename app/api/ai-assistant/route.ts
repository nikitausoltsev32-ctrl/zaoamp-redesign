import { NextResponse } from 'next/server'
import { generateAssistantReply, type AssistantMessage } from '@/lib/ai/assistant'
import { appendAiLead } from '@/lib/ai/lead-store'
import { getAssistantLeadStage } from '@/lib/ai/lead'
import { escapeHtml, sendTelegram } from '@/lib/telegram'

const PHONE_PATTERN = /(?:\+?\d[\d\s().-]{8,}\d)/

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function buildSessionId(value: unknown) {
  const sessionId = getString(value)
  return sessionId || crypto.randomUUID()
}

function normalizeMessages(value: unknown): AssistantMessage[] {
  if (!Array.isArray(value)) return []

  return value
    .map((message) => {
      if (!message || typeof message !== 'object') return null
      const role = (message as { role?: unknown }).role
      const content = getString((message as { content?: unknown }).content)

      if ((role !== 'user' && role !== 'assistant') || !content) return null
      return { role, content }
    })
    .filter((message): message is AssistantMessage => Boolean(message))
    .slice(-16)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sessionId = buildSessionId(body?.sessionId)
    const pagePath = getString(body?.pagePath).slice(0, 300)
    const messages = normalizeMessages(body?.messages)

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'Сообщение обязательно' },
        { status: 400 }
      )
    }

    const result = await generateAssistantReply(messages, pagePath)
    let saved = false

    // Уведомляем в Telegram один раз — когда в диалоге впервые появился телефон
    const userMessages = messages.filter((message) => message.role === 'user')
    const earlierText = userMessages.slice(0, -1).map((message) => message.content).join('\n')

    // Fallback: LLM не извлёк телефон, но он есть в последнем сообщении пользователя
    if (!result.lead.phone?.trim()) {
      const lastUserText = userMessages.at(-1)?.content ?? ''
      const phoneMatch = lastUserText.match(PHONE_PATTERN)
      if (phoneMatch) {
        result.lead.phone = phoneMatch[0].trim()
      }
    }

    const phoneJustCaptured =
      Boolean(result.lead.phone?.trim()) && !PHONE_PATTERN.test(earlierText)

    if (phoneJustCaptured) {
      const lead = result.lead

      try {
        await appendAiLead({
          lead,
          pagePath,
          sessionId,
          capturedAt: new Date().toISOString(),
        })
        saved = true
      } catch (storeError) {
        console.error('[ai-assistant] Lead file write failed:', storeError, JSON.stringify(lead))
      }

      const lines = [
        '<b>Новый лид из AI-чата</b>',
        lead.name ? `Имя: <b>${escapeHtml(lead.name)}</b>` : '',
        `Телефон: <b>${escapeHtml(lead.phone ?? '')}</b>`,
        lead.city ? `Город: ${escapeHtml(lead.city)}` : '',
        lead.productInterest ? `Товар: ${escapeHtml(lead.productInterest)}` : '',
        lead.quantityTons ? `Объём: ${lead.quantityTons} т` : '',
        lead.packaging ? `Упаковка: ${escapeHtml(lead.packaging)}` : '',
        lead.budget ? `Бюджет/сроки: ${escapeHtml(lead.budget)}` : '',
        lead.need ? `Задача: ${escapeHtml(lead.need)}` : '',
        lead.summary ? `Итог: ${escapeHtml(lead.summary)}` : '',
        pagePath ? `Страница: ${escapeHtml(pagePath)}` : '',
        `Время: ${new Date().toLocaleString('ru-RU')}`,
      ].filter(Boolean)

      try {
        await sendTelegram(lines.join('\n'))
        saved = true
      } catch (telegramError) {
        console.error('[ai-assistant] Telegram send failed, lead persisted to file:', telegramError)
      }
    }

    return NextResponse.json({
      sessionId,
      reply: result.reply,
      structured: result.structured ?? null,
      lead: result.lead,
      stage: getAssistantLeadStage(result.lead),
      sources: (result.sources ?? []).map((source) => ({
        title: source.title,
        url: source.url,
        provider: source.provider,
      })),
      saved,
      provider: result.provider,
    })
  } catch (error) {
    console.error('[ai-assistant] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка AI-менеджера' },
      { status: 500 }
    )
  }
}
