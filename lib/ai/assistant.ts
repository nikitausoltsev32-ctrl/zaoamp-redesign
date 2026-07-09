import {
  enrichAssistantLead,
  shouldPersistAssistantLead,
  withManagerHandoffConfirmation,
  type AssistantLeadDraft,
} from './lead'
import {
  buildAssistantKnowledgeContext,
  buildRuleBasedAssistantReply,
} from './knowledge'
import {
  buildInternetContext,
  type AssistantInternetContext,
  type AssistantSource,
} from './web-context'

export type AssistantRole = 'user' | 'assistant'

export interface AssistantMessage {
  role: AssistantRole
  content: string
}

export type AssistantLead = AssistantLeadDraft

export interface AssistantStructured {
  solution?: string | null
  recommendation?: string | null
  nextStep?: string | null
  handoff?: string | null
  internetNote?: string | null
}

export interface AssistantResult {
  reply: string
  structured?: AssistantStructured
  lead: AssistantLead
  shouldSave: boolean
  provider: 'groq' | 'gemini' | 'fallback'
  sources?: AssistantSource[]
}

const ASSISTANT_OUTPUT_HINT = `Ответь строго JSON без markdown:
{
  "reply": "разговорный ответ менеджера, 2-3 предложения на русском",
  "structured": {
    "solution": "конкретный продукт/фракция если уже понятно, иначе null",
    "recommendation": "1-2 ключевые рекомендации если есть, иначе null",
    "nextStep": "что нужно уточнить или что будет дальше, всегда заполняй",
    "handoff": "текст о передаче менеджеру если телефон уже есть, иначе null",
    "internetNote": "если использовал внешний интернет-контекст, коротко что именно сверил, иначе null"
  },
  "lead": {
    "name": "имя если известно",
    "phone": "телефон если известен",
    "city": "город доставки если известен",
    "need": "задача клиента",
    "productInterest": "интересующий продукт или фракция",
    "quantityTons": null,
    "packaging": "упаковка",
    "budget": "бюджет или сроки если известны",
    "summary": "краткое резюме интереса"
  },
  "shouldSave": true
}`

function currentDateRu() {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeZone: 'Asia/Yekaterinburg',
  }).format(new Date())
}

function systemPrompt(internetContext: AssistantInternetContext, pagePath?: string) {
  const internetBlock = internetContext.contextText
    ? `Используй эти найденные источники только как дополнительный контекст. Если отвечаешь по ним, кратко упомяни, что сверил внешние источники.\n\n${internetContext.contextText}`
    : internetContext.error
      ? `${internetContext.error} Если клиент просит актуальные данные из интернета, честно скажи, что интернет-поиск сейчас не подключен, и помоги по каталогу/заявке.`
      : 'Внешний интернет-контекст для этого вопроса не запрашивался. Отвечай по базе ЗАО АМП.'

  const pageContextBlock = pagePath 
    ? `\nТЕКУЩИЙ КОНТЕКСТ: Клиент сейчас просматривает страницу сайта: ${pagePath}. Обязательно учитывай это! Например, если он на странице доставки, сфокусируйся на логистике; если на карточке товара, предполагай, что он спрашивает именно про этот продукт.`
    : ''

  return `Ты Алекс — живой AI-менеджер продаж ЗАО АМП. Компания производит мраморную крошку, щебень, мраморную муку и микрокальцит. Работаешь с B2B клиентами: строители, ландшафтники, производители.
Текущая дата: ${currentDateRu()}.${pageContextBlock}

КАК ТЫ РАЗГОВАРИВАЕШЬ:
- Живо и по-человечески, как опытный коллега. "Хорошо, разберёмся" вместо "Информация принята к обработке".
- Уточняешь 1-2 вещи за раз — не засыпаешь анкетой.
- Когда понятна задача — сразу называешь конкретный продукт из каталога и объясняешь почему именно он.
- Мягко и естественно предлагаешь оставить телефон для КП: "Если скинете телефон — менеджер рассчитает точно с доставкой".

СЦЕНАРИЙ РАЗГОВОРА:
1. Первый вопрос → уточни главную задачу, если ещё не понятно.
2. Квалификация → узнай объём, город, как применяют.
3. Рекомендация → назови продукт из каталога, коротко объясни выбор.
4. Сбор контакта → предложи телефон для КП.
5. Передача → если телефон есть, скажи что передал менеджеру.

ПРАВИЛА:
- Не обещай точные остатки, точные сроки, финальную цену — это подтвердит менеджер.
- Если в каталоге есть pricePerTon — можешь назвать как ориентир, сразу добавив "без доставки, финальная цена с менеджером".
- Не выдумывай скидки, сертификаты, паспорта качества. По документам: "менеджер подтвердит доступные паспорта под партию".
- Используй только продукты из каталога ниже.

БАЗА ЗНАНИЙ ЗАО АМП:
${buildAssistantKnowledgeContext()}

ИНТЕРНЕТ-КОНТЕКСТ:
${internetBlock}

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

function parseStructured(raw: unknown): AssistantStructured | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const s = raw as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)
  return {
    solution: str(s.solution),
    recommendation: str(s.recommendation),
    nextStep: str(s.nextStep),
    handoff: str(s.handoff),
    internetNote: str(s.internetNote),
  }
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
    structured?: unknown
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

  const structured = parseStructured(parsed.structured)
  const baseReply = typeof parsed.reply === 'string' && parsed.reply.trim()
    ? parsed.reply.trim()
    : 'Уточните, пожалуйста, город доставки, объем в тоннах и задачу. Я подберу подходящую фракцию.'

  const reply = structured?.handoff
    ? baseReply
    : withManagerHandoffConfirmation(baseReply, lead)

  return {
    reply,
    structured,
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
    reply: 'Привет! Расскажите, для какой задачи нужен материал — ландшафт, штукатурка, бетон, производство? Подберу подходящую фракцию.',
    structured: {
      solution: null,
      recommendation: null,
      nextStep: 'Опишите задачу, город и примерный объём — и я сразу назову подходящий вариант.',
      handoff: null,
    },
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

function sourceSummaryFallback(
  internetContext: AssistantInternetContext,
  lead: AssistantLead
) {
  if (internetContext.sources.length > 0) {
    const sourceLines = internetContext.sources
      .slice(0, 3)
      .map((source, index) => {
        const snippet = source.snippet ? ` - ${source.snippet.slice(0, 260)}` : ''
        return `${index + 1}. ${source.title}${snippet}`
      })
      .join('\n')
    const reply = [
      'Проверил доступные внешние источники:',
      sourceLines,
      'Если нужно применить это к продукции АМП, напишите задачу, город и объем - подберу фракцию и соберу данные для КП.',
    ].join('\n')

    return {
      reply: withManagerHandoffConfirmation(reply, lead),
      structured: {
        solution: null,
        recommendation: 'Внешний источник найден; для коммерческого расчета нужны задача, город, объем и упаковка.',
        nextStep: 'Уточните, что именно сравнить или рассчитать по продукции АМП.',
        handoff: lead.phone ? 'Контакт есть - менеджер сможет подключиться к расчету.' : null,
        internetNote: `Сверил ${internetContext.sources.length} внешн. источник(а).`,
      },
    }
  }

  if (internetContext.error) {
    const reply = [
      internetContext.error,
      'По каталогу АМП я все равно могу подобрать материал, цену-ориентир без доставки, упаковку и список данных для КП.',
    ].join(' ')

    return {
      reply: withManagerHandoffConfirmation(reply, lead),
      structured: {
        solution: null,
        recommendation: 'Для актуального web-поиска добавьте TAVILY_API_KEY или BRAVE_SEARCH_API_KEY в окружение.',
        nextStep: 'Напишите задачу по материалу или подключите ключ поиска на Vercel.',
        handoff: lead.phone ? 'Контакт есть - менеджер сможет уточнить условия вручную.' : null,
        internetNote: 'Полноценный интернет-поиск пока не подключен.',
      },
    }
  }

  return null
}

async function callGroq(
  messages: AssistantMessage[],
  internetContext: AssistantInternetContext,
  pagePath?: string
): Promise<AssistantResult> {
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
        { role: 'system', content: systemPrompt(internetContext, pagePath) },
        ...messages,
      ],
      temperature: 0.5,
      max_tokens: 500,
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

  return { ...parseAssistantJson(text, messages), provider: 'groq', sources: internetContext.sources }
}

async function callGemini(
  messages: AssistantMessage[],
  internetContext: AssistantInternetContext,
  pagePath?: string
): Promise<AssistantResult> {
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
            { text: `${systemPrompt(internetContext, pagePath)}\n\nДиалог:\n${conversation}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 500,
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

  return { ...parseAssistantJson(text, messages), provider: 'gemini', sources: internetContext.sources }
}

function fallbackResult(
  messages: AssistantMessage[],
  internetContext: AssistantInternetContext
): AssistantResult {
  const fallback = finalizeFallbackLead(messages)
  const ruleBased = buildRuleBasedAssistantReply(messages, fallback.lead)
  const sourceFallback = ruleBased.structured.solution
    ? null
    : sourceSummaryFallback(internetContext, fallback.lead)

  return {
    provider: 'fallback',
    lead: fallback.lead,
    reply: sourceFallback?.reply ?? ruleBased.reply,
    structured: sourceFallback?.structured ?? ruleBased.structured,
    shouldSave: fallback.shouldSave,
    sources: internetContext.sources,
  }
}

export async function generateAssistantReply(
  rawMessages: AssistantMessage[], 
  pagePath?: string
): Promise<AssistantResult> {
  const messages = normalizeMessages(rawMessages)
  if (messages.length === 0) {
    return emptyFallbackResult()
  }

  let internetContext: AssistantInternetContext
  try {
    internetContext = await buildInternetContext(messages)
  } catch (internetError) {
    console.warn('[ai-assistant] Internet context failed:', internetError)
    internetContext = {
      query: '',
      sources: [],
      contextText: '',
      provider: 'not-configured',
      error: 'Интернет-контекст не удалось получить. Отвечай по базе ЗАО АМП.',
    }
  }

  try {
    return await callGroq(messages, internetContext, pagePath)
  } catch (groqError) {
    console.warn('[ai-assistant] Groq failed, trying Gemini:', groqError)
  }

  try {
    return await callGemini(messages, internetContext, pagePath)
  } catch (geminiError) {
    console.warn('[ai-assistant] Gemini failed, using fallback:', geminiError)
  }

  return fallbackResult(messages, internetContext)
}
