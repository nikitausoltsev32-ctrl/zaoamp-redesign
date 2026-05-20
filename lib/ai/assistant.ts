import { products } from '@/lib/data/products'
import {
  enrichAssistantLead,
  shouldPersistAssistantLead,
  withManagerHandoffConfirmation,
  type AssistantLeadDraft,
} from './lead'

export type AssistantRole = 'user' | 'assistant'

export interface AssistantMessage {
  role: AssistantRole
  content: string
}

export type AssistantLead = AssistantLeadDraft

export interface AssistantResult {
  reply: string
  lead: AssistantLead
  shouldSave: boolean
  provider: 'groq' | 'gemini' | 'fallback'
}

const ASSISTANT_OUTPUT_HINT = `Ответь строго JSON без markdown:
{
  "reply": "короткий ответ клиенту на русском",
  "lead": {
    "name": "имя если известно",
    "phone": "телефон если известен",
    "city": "город доставки если известен",
    "need": "задача клиента",
    "productInterest": "интересующий продукт или фракция",
    "quantityTons": 10,
    "packaging": "упаковка",
    "budget": "бюджет если известен",
    "summary": "краткое резюме интереса"
  },
  "shouldSave": true
}`

function productCatalogForPrompt() {
  return products.map((product) => ({
    name: product.name,
    slug: product.slug,
    category: product.category,
    fraction: product.fraction,
    pricePerTon: product.pricePerTon ?? null,
    description: product.description,
    applications: product.applications,
    packaging: product.specifications.packaging,
    whiteness: product.specifications.whiteness,
    caco3: product.specifications.caco3 ?? null,
  }))
}

function systemPrompt() {
  return `Ты AI-менеджер сайта ЗАО АМП, производителя мраморной крошки, щебня и микрокальцита.

Цель: помочь посетителю подобрать фракцию, понять примерный продукт, собрать заявку и передать менеджеру.

Правила:
- Пиши по-русски, живо и по делу, как внимательный B2B-менеджер. Не будь сухим ботом, но не раздувай ответ.
- Не обещай точный остаток, точную доставку, дату отгрузки и финальную цену. Пиши, что менеджер подтвердит наличие, логистику и итоговые условия.
- Используй только каталог ниже. Если информации нет, честно попроси уточнение.
- Подробно, но без выдумок объясняй продукцию: мраморная крошка для декора/ландшафта/штукатурок/смесей, щебень для строительства/дренажа/бетона, мраморная мука и микрокальцит для тонких промышленных задач.
- Активно собирай поля заявки: имя, телефон, город доставки, продукт или фракция, объем в тоннах, упаковка, задача применения, сроки или бюджет.
- Если телефон уже есть, прямо скажи в reply: "Передал информацию менеджеру, с вами свяжутся". Не спрашивай разрешение еще раз.
- Не выдумывай скидки, сертификаты, паспорта качества, сроки отгрузки и города доставки. По документам говори, что менеджер подтвердит доступные паспорта/сертификаты под конкретную партию.
- Для калькуляций называй только ориентир по товару без доставки и отмечай, что доставка и финальная цена подтверждаются отдельно.
- Если клиент спрашивает "что выбрать", дай 2-3 подходящих варианта из каталога и сразу попроси недостающие lead-поля.

Каталог:
${JSON.stringify(productCatalogForPrompt())}

${ASSISTANT_OUTPUT_HINT}`
}

function normalizeMessages(messages: AssistantMessage[]) {
  return messages
    .filter((message) =>
      (message.role === 'user' || message.role === 'assistant') &&
      typeof message.content === 'string' &&
      message.content.trim().length > 0
    )
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1500),
    }))
}

function parseAssistantJson(
  text: string,
  messages: AssistantMessage[]
): Omit<AssistantResult, 'provider'> {
  const trimmed = text.trim()
  const jsonText = trimmed.startsWith('{')
    ? trimmed
    : trimmed.slice(trimmed.indexOf('{'), trimmed.lastIndexOf('}') + 1)

  const parsed = JSON.parse(jsonText) as {
    reply?: unknown
    lead?: Record<string, unknown>
    shouldSave?: unknown
  }

  const parsedLead = parsed.lead && typeof parsed.lead === 'object'
    ? parsed.lead
    : {}

  const quantityTons = typeof parsedLead.quantityTons === 'number'
    ? parsedLead.quantityTons
    : typeof parsedLead.quantityTons === 'string'
      ? Number(parsedLead.quantityTons.replace(',', '.'))
      : undefined

  const lead = enrichAssistantLead({
    name: typeof parsedLead.name === 'string' ? parsedLead.name.trim() : undefined,
    phone: typeof parsedLead.phone === 'string' ? parsedLead.phone.trim() : undefined,
    city: typeof parsedLead.city === 'string' ? parsedLead.city.trim() : undefined,
    need: typeof parsedLead.need === 'string' ? parsedLead.need.trim() : undefined,
    productInterest: typeof parsedLead.productInterest === 'string' ? parsedLead.productInterest.trim() : undefined,
    quantityTons: Number.isFinite(quantityTons) ? quantityTons : undefined,
    packaging: typeof parsedLead.packaging === 'string' ? parsedLead.packaging.trim() : undefined,
    budget: typeof parsedLead.budget === 'string' ? parsedLead.budget.trim() : undefined,
    summary: typeof parsedLead.summary === 'string' ? parsedLead.summary.trim() : undefined,
  }, messages)
  const baseReply = typeof parsed.reply === 'string' && parsed.reply.trim()
    ? parsed.reply.trim()
    : 'Уточните, пожалуйста, город доставки, объем в тоннах и задачу. Я подберу подходящую фракцию.'

  return {
    reply: withManagerHandoffConfirmation(baseReply, lead),
    lead,
    shouldSave: shouldPersistAssistantLead(lead, parsed.shouldSave === true, messages),
  }
}

function buildFallbackReply(lead: AssistantLead) {
  if (lead.phone) {
    return withManagerHandoffConfirmation(
      'Заявку зафиксировал. Менеджер уточнит детали по материалу, документам, доставке и финальной цене.',
      lead
    )
  }

  return [
    'Сейчас AI-подборщик не получил ответ от модели, но я могу собрать заявку для менеджера.',
    'Напишите имя, телефон, город доставки, продукт или фракцию, объем в тоннах, упаковку, задачу и желаемые сроки или бюджет.',
    'По наличию, доставке, документам и финальной цене условия подтвердит менеджер.',
  ].join(' ')
}

function emptyFallbackResult(): AssistantResult {
  return {
    provider: 'fallback',
    reply: 'Напишите, для какой задачи нужен материал: производство, бетон, ландшафт, штукатурка или другое. Я подберу фракцию и соберу заявку. Для расчета также нужны город, объем, упаковка и телефон.',
    lead: {},
    shouldSave: false,
  }
}

function finalizeFallbackLead(messages: AssistantMessage[]) {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content ?? ''
  const lead = enrichAssistantLead({
    need: lastUserMessage.slice(0, 500) || undefined,
    summary: lastUserMessage ? `Запрос из AI-чата: ${lastUserMessage.slice(0, 500)}` : 'Запрос из AI-чата',
  }, messages)

  return {
    lead,
    reply: buildFallbackReply(lead),
    shouldSave: shouldPersistAssistantLead(lead, false, messages),
  }
}

async function callGroq(messages: AssistantMessage[]): Promise<AssistantResult> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt() },
        ...messages,
      ],
      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq request failed: ${response.status}`)
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const text = data.choices?.[0]?.message?.content
  if (!text) {
    throw new Error('Groq returned empty content')
  }

  return { ...parseAssistantJson(text, messages), provider: 'groq' }
}

async function callGemini(messages: AssistantMessage[]): Promise<AssistantResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
  const conversation = messages
    .map((message) => `${message.role === 'user' ? 'Клиент' : 'Менеджер'}: ${message.content}`)
    .join('\n')

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt()}\n\nДиалог:\n${conversation}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 700,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`)
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Gemini returned empty content')
  }

  return { ...parseAssistantJson(text, messages), provider: 'gemini' }
}

function fallbackResult(messages: AssistantMessage[]): AssistantResult {
  const fallback = finalizeFallbackLead(messages)

  return {
    provider: 'fallback',
    ...fallback,
  }
}

export async function generateAssistantReply(rawMessages: AssistantMessage[]): Promise<AssistantResult> {
  const messages = normalizeMessages(rawMessages)
  if (messages.length === 0) {
    return emptyFallbackResult()
  }

  try {
    return await callGroq(messages)
  } catch (groqError) {
    console.warn('[ai-assistant] Groq failed, trying Gemini:', groqError)
  }

  try {
    return await callGemini(messages)
  } catch (geminiError) {
    console.warn('[ai-assistant] Gemini failed, using fallback:', geminiError)
  }

  return fallbackResult(messages)
}
