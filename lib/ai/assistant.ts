import { products } from '@/lib/data/products'

export type AssistantRole = 'user' | 'assistant'

export interface AssistantMessage {
  role: AssistantRole
  content: string
}

export interface AssistantLead {
  name?: string
  phone?: string
  city?: string
  need?: string
  productInterest?: string
  quantityTons?: number
  packaging?: string
  budget?: string
  summary?: string
}

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
- Пиши по-русски, кратко, как менеджер B2B-продаж.
- Не обещай точный остаток, точную доставку и финальную цену. Пиши, что менеджер подтвердит условия.
- Используй только каталог ниже. Если информации нет, честно попроси уточнение.
- Сначала выясняй задачу, город доставки, объем в тоннах, упаковку и телефон.
- Если телефон уже есть, предложи передать заявку менеджеру.
- Не выдумывай скидки, сертификаты, сроки отгрузки и города доставки.
- Для калькуляций называй только примерный товар без доставки.

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

function parseAssistantJson(text: string): Omit<AssistantResult, 'provider'> {
  const trimmed = text.trim()
  const jsonText = trimmed.startsWith('{')
    ? trimmed
    : trimmed.slice(trimmed.indexOf('{'), trimmed.lastIndexOf('}') + 1)

  const parsed = JSON.parse(jsonText) as {
    reply?: unknown
    lead?: Record<string, unknown>
    shouldSave?: unknown
  }

  const lead = parsed.lead && typeof parsed.lead === 'object'
    ? parsed.lead
    : {}

  const quantityTons = typeof lead.quantityTons === 'number'
    ? lead.quantityTons
    : typeof lead.quantityTons === 'string'
      ? Number(lead.quantityTons.replace(',', '.'))
      : undefined

  return {
    reply: typeof parsed.reply === 'string' && parsed.reply.trim()
      ? parsed.reply.trim()
      : 'Уточните, пожалуйста, город доставки, объем в тоннах и задачу. Я подберу подходящую фракцию.',
    lead: {
      name: typeof lead.name === 'string' ? lead.name.trim() : undefined,
      phone: typeof lead.phone === 'string' ? lead.phone.trim() : undefined,
      city: typeof lead.city === 'string' ? lead.city.trim() : undefined,
      need: typeof lead.need === 'string' ? lead.need.trim() : undefined,
      productInterest: typeof lead.productInterest === 'string' ? lead.productInterest.trim() : undefined,
      quantityTons: Number.isFinite(quantityTons) ? quantityTons : undefined,
      packaging: typeof lead.packaging === 'string' ? lead.packaging.trim() : undefined,
      budget: typeof lead.budget === 'string' ? lead.budget.trim() : undefined,
      summary: typeof lead.summary === 'string' ? lead.summary.trim() : undefined,
    },
    shouldSave: parsed.shouldSave !== false,
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

  return { ...parseAssistantJson(text), provider: 'groq' }
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

  return { ...parseAssistantJson(text), provider: 'gemini' }
}

function fallbackResult(messages: AssistantMessage[]): AssistantResult {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content ?? ''

  return {
    provider: 'fallback',
    reply: 'Сейчас AI-подборщик не получил ответ от модели. Напишите город доставки, объем в тоннах, задачу и телефон - менеджер подготовит подбор и КП.',
    lead: {
      need: lastUserMessage.slice(0, 500),
      summary: lastUserMessage ? `Запрос из AI-чата: ${lastUserMessage.slice(0, 500)}` : 'Запрос из AI-чата',
    },
    shouldSave: true,
  }
}

export async function generateAssistantReply(rawMessages: AssistantMessage[]): Promise<AssistantResult> {
  const messages = normalizeMessages(rawMessages)
  if (messages.length === 0) {
    return {
      provider: 'fallback',
      reply: 'Напишите, для какой задачи нужен материал: производство, бетон, ландшафт, штукатурка или другое. Я подберу фракцию и соберу заявку.',
      lead: {},
      shouldSave: false,
    }
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
