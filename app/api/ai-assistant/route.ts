import { NextResponse } from 'next/server'
import { generateAssistantReply, type AssistantMessage } from '@/lib/ai/assistant'
import { supabaseAdmin } from '@/lib/supabase/server'

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

    const result = await generateAssistantReply(messages)
    let saved = false

    if (supabaseAdmin && result.shouldSave) {
      const { error } = await supabaseAdmin
        .from('ai_assistant_leads')
        .upsert(
          {
            session_id: sessionId,
            lead_type: 'ai_assistant',
            name: result.lead.name ?? null,
            phone: result.lead.phone ?? null,
            city: result.lead.city ?? null,
            need: result.lead.need ?? null,
            product_interest: result.lead.productInterest ?? null,
            quantity_tons: result.lead.quantityTons ?? null,
            packaging: result.lead.packaging ?? null,
            budget: result.lead.budget ?? null,
            summary: result.lead.summary ?? null,
            messages,
            source_path: pagePath || null,
            provider: result.provider,
            status: 'new',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'session_id' }
        )

      if (error) {
        console.error('[ai-assistant] Supabase save error:', error)
      } else {
        saved = true
      }
    }

    return NextResponse.json({
      sessionId,
      reply: result.reply,
      lead: result.lead,
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
