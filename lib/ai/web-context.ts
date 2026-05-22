import type { AssistantLeadMessage } from './lead'

export interface AssistantSource {
  title: string
  url: string
  snippet?: string
  provider: 'tavily' | 'brave' | 'direct-url'
}

export interface AssistantInternetContext {
  query: string
  sources: AssistantSource[]
  contextText: string
  provider: 'tavily' | 'brave' | 'direct-url' | 'not-configured' | 'none'
  error?: string
}

const URL_PATTERN = /https?:\/\/[^\s<>"')]+/gi
const INTERNET_INTENT_PATTERN =
  /(интернет|найди|поищи|проверь|актуальн|сейчас|сегодня|новост|рынок|конкурент|сравни|гост|санпин|норматив|тренд|поставщик|дилер|цена на рынке)/i

function lastUserText(messages: AssistantLeadMessage[]) {
  return [...messages].reverse().find((message) => message.role === 'user')?.content ?? ''
}

function stripUrls(value: string) {
  return value.replace(URL_PATTERN, '').replace(/\s+/g, ' ').trim()
}

function wantsInternetLookup(value: string) {
  return URL_PATTERN.test(value) || INTERNET_INTENT_PATTERN.test(value)
}

function cleanSnippet(value: string, maxLength = 900) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength)
}

function htmlToText(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function extractTitle(html: string, fallbackUrl: string) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  return cleanSnippet(title ? htmlToText(title) : fallbackUrl, 120)
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split('.').map((part) => Number(part))
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false
  }

  const [a, b] = parts
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a === 169 && b === 254 ||
    a === 172 && b >= 16 && b <= 31 ||
    a === 192 && b === 168 ||
    a === 100 && b >= 64 && b <= 127
  )
}

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase()
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host === '::1' ||
    host.startsWith('fc') ||
    host.startsWith('fd') ||
    host.startsWith('fe80') ||
    isPrivateIpv4(host)
  )
}

function parsePublicUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    if (url.username || url.password) return null
    if (isBlockedHostname(url.hostname)) return null
    return url
  } catch {
    return null
  }
}

function extractPublicUrls(value: string) {
  const urls = value.match(URL_PATTERN) ?? []
  return urls
    .map((url) => parsePublicUrl(url))
    .filter((url): url is URL => Boolean(url))
    .slice(0, 2)
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 7000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchDirectSource(url: URL): Promise<AssistantSource | null> {
  try {
    const response = await fetchWithTimeout(url.toString(), {
      headers: {
        Accept: 'text/html,text/plain,application/json',
        'User-Agent': 'ZAO AMP AI assistant (+https://amp-minerals.ru)',
      },
      redirect: 'follow',
    })

    if (!response.ok) return null
    const contentType = response.headers.get('content-type') ?? ''
    if (!/(text\/html|text\/plain|application\/json|application\/ld\+json)/i.test(contentType)) {
      return null
    }

    const body = await response.text()
    const text = contentType.includes('html') ? htmlToText(body) : body
    return {
      title: contentType.includes('html') ? extractTitle(body, url.hostname) : url.hostname,
      url: url.toString(),
      snippet: cleanSnippet(text, 1200),
      provider: 'direct-url',
    }
  } catch {
    return null
  }
}

async function searchTavily(query: string): Promise<AssistantSource[]> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      search_depth: 'basic',
      max_results: 4,
      include_answer: false,
      include_raw_content: 'text',
      include_images: false,
      country: 'russia',
      safe_search: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.status}`)
  }

  const data = await response.json() as {
    results?: Array<{
      title?: string
      url?: string
      content?: string
      raw_content?: string | null
    }>
  }

  return (data.results ?? [])
    .map<AssistantSource | null>((result) => {
      const url = typeof result.url === 'string' ? parsePublicUrl(result.url) : null
      if (!url) return null
      return {
        title: cleanSnippet(result.title || url.hostname, 120),
        url: url.toString(),
        snippet: cleanSnippet(result.raw_content || result.content || '', 1200),
        provider: 'tavily' as const,
      }
    })
    .filter((source): source is AssistantSource => Boolean(source))
}

async function searchBrave(query: string): Promise<AssistantSource[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    q: query,
    count: '4',
    country: 'RU',
    search_lang: 'ru',
    ui_lang: 'ru-RU',
    safesearch: 'moderate',
    extra_snippets: 'true',
  })
  const response = await fetchWithTimeout(`https://api.search.brave.com/res/v1/web/search?${params}`, {
    headers: {
      'X-Subscription-Token': apiKey,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Brave search failed: ${response.status}`)
  }

  const data = await response.json() as {
    web?: {
      results?: Array<{
        title?: string
        url?: string
        description?: string
        extra_snippets?: string[]
      }>
    }
  }

  return (data.web?.results ?? [])
    .map<AssistantSource | null>((result) => {
      const url = typeof result.url === 'string' ? parsePublicUrl(result.url) : null
      if (!url) return null
      return {
        title: cleanSnippet(result.title || url.hostname, 120),
        url: url.toString(),
        snippet: cleanSnippet([
          result.description ?? '',
          ...(result.extra_snippets ?? []),
        ].join(' '), 1200),
        provider: 'brave' as const,
      }
    })
    .filter((source): source is AssistantSource => Boolean(source))
}

function dedupeSources(sources: AssistantSource[]) {
  const seen = new Set<string>()
  return sources.filter((source) => {
    const key = source.url.replace(/\/$/, '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function buildContextText(sources: AssistantSource[]) {
  return sources
    .map((source, index) => [
      `[${index + 1}] ${source.title}`,
      `URL: ${source.url}`,
      `Источник: ${source.provider}`,
      source.snippet ? `Фрагмент: ${source.snippet}` : '',
    ].filter(Boolean).join('\n'))
    .join('\n\n')
}

export async function buildInternetContext(messages: AssistantLeadMessage[]): Promise<AssistantInternetContext> {
  const userText = lastUserText(messages)
  if (!wantsInternetLookup(userText)) {
    return {
      query: '',
      sources: [],
      contextText: '',
      provider: 'none',
    }
  }

  const urls = extractPublicUrls(userText)
  const directSources = (await Promise.all(urls.map((url) => fetchDirectSource(url))))
    .filter((source): source is AssistantSource => Boolean(source))

  const query = stripUrls(userText).slice(0, 240)
  let searchSources: AssistantSource[] = []
  let provider: AssistantInternetContext['provider'] = directSources.length ? 'direct-url' : 'not-configured'

  if (query && process.env.TAVILY_API_KEY) {
    searchSources = await searchTavily(query)
    provider = 'tavily'
  } else if (query && process.env.BRAVE_SEARCH_API_KEY) {
    searchSources = await searchBrave(query)
    provider = 'brave'
  }

  const sources = dedupeSources([...directSources, ...searchSources]).slice(0, 5)
  const contextText = buildContextText(sources)

  return {
    query,
    sources,
    contextText,
    provider,
    error: provider === 'not-configured'
      ? 'Интернет-поиск не подключен: нужен TAVILY_API_KEY или BRAVE_SEARCH_API_KEY.'
      : undefined,
  }
}
