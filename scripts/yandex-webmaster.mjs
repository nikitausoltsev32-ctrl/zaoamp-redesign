import { writeFileSync, mkdirSync } from 'node:fs'

// Обвязка к Yandex Webmaster API v4 для SEO-аудита.
// Токен: https://oauth.yandex.ru/authorize?response_type=token&client_id=<CLIENT_ID>
// Права приложения: webmaster:hostinfo (и webmaster:verify, если нужна верификация).
//
//   YANDEX_WEBMASTER_TOKEN=y0_Ag... node scripts/yandex-webmaster.mjs <команда> [--out dir]
//
// Команды: hosts | summary | indexing | queries | links | all

const TOKEN = process.env.YANDEX_WEBMASTER_TOKEN
const API = 'https://api.webmaster.yandex.net/v4'
const HOST_HINT = 'amp-minerals.ru'

if (!TOKEN) {
  console.error('Нужен YANDEX_WEBMASTER_TOKEN. Получить:')
  console.error('https://oauth.yandex.ru/authorize?response_type=token&client_id=<CLIENT_ID>')
  process.exit(1)
}

const args = process.argv.slice(2)
const command = args[0] ?? 'all'
const outIdx = args.indexOf('--out')
const outDir = outIdx !== -1 ? args[outIdx + 1] : null

async function api(path, params) {
  const url = new URL(API + path)
  // Повторяющиеся ключи (query_indicator, indexing_indicator) передаём массивом
  for (const [key, value] of Object.entries(params ?? {})) {
    for (const v of Array.isArray(value) ? value : [value]) url.searchParams.append(key, v)
  }
  const res = await fetch(url, { headers: { Authorization: `OAuth ${TOKEN}` } })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`${res.status} ${url.pathname}${url.search}\n${text.slice(0, 500)}`)
  }
  return JSON.parse(text)
}

// Дата в формате API — ISO без миллисекунд
const iso = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => iso(new Date(Date.now() - n * 86400_000))

async function resolveHost() {
  const { user_id } = await api('/user/')
  const { hosts } = await api(`/user/${user_id}/hosts`)
  const host =
    hosts.find((h) => h.unicode_host_url?.includes(HOST_HINT)) ??
    hosts.find((h) => h.ascii_host_url?.includes(HOST_HINT)) ??
    hosts[0]
  if (!host) throw new Error('В аккаунте нет ни одного сайта')
  return { userId: user_id, host }
}

const sections = {
  async hosts({ userId }) {
    return api(`/user/${userId}/hosts`)
  },

  // ИКС, права, главное зеркало, региональность
  async summary({ userId, host }) {
    const [info, summary] = await Promise.all([
      api(`/user/${userId}/hosts/${host.host_id}`),
      api(`/user/${userId}/hosts/${host.host_id}/summary`),
    ])
    return { info, summary }
  },

  // Сколько страниц в поиске и сколько исключено, за 3 месяца
  async indexing({ userId, host }) {
    const [history, inSearch] = await Promise.all([
      api(`/user/${userId}/hosts/${host.host_id}/indexing/history`, {
        date_from: daysAgo(90),
        date_to: iso(new Date()),
        indexing_indicator: ['SEARCHABLE', 'DOWNLOADED', 'EXCLUDED'],
      }),
      api(`/user/${userId}/hosts/${host.host_id}/search-urls/in-search/samples`, { limit: 100 }),
    ])
    return { history, in_search_samples: inSearch }
  },

  // Реальные запросы: показы, клики, CTR, средняя позиция
  async queries({ userId, host }) {
    return api(`/user/${userId}/hosts/${host.host_id}/search-queries/popular`, {
      order_by: 'TOTAL_SHOWS',
      query_indicator: ['TOTAL_SHOWS', 'TOTAL_CLICKS', 'AVG_SHOW_POSITION', 'AVG_CLICK_POSITION'],
      date_from: daysAgo(90),
      date_to: iso(new Date()),
      limit: 500,
    })
  },

  // Внешние ссылки по версии Яндекса — то, чего не дал Common Crawl
  async links({ userId, host }) {
    const [history, samples] = await Promise.all([
      api(`/user/${userId}/hosts/${host.host_id}/links/external/history`, {
        indicator: 'LINKS_TOTAL_COUNT',
      }),
      api(`/user/${userId}/hosts/${host.host_id}/links/external/samples`, { limit: 100 }),
    ])
    return { history, samples }
  },
}

function report(name, data) {
  if (outDir) {
    mkdirSync(outDir, { recursive: true })
    const file = `${outDir}/yandex-${name}.json`
    writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
    console.log(`  ${name} -> ${file}`)
  } else {
    console.log(`\n===== ${name} =====`)
    console.log(JSON.stringify(data, null, 2))
  }
}

const { userId, host } = await resolveHost()
console.log(`Сайт: ${host.unicode_host_url ?? host.ascii_host_url}  (host_id ${host.host_id})`)
console.log(`Права подтверждены: ${host.verified}`)

const wanted = command === 'all' ? Object.keys(sections) : [command]
let failed = 0

for (const name of wanted) {
  if (!sections[name]) {
    console.error(`Неизвестная команда: ${name}. Доступно: ${Object.keys(sections).join(', ')}, all`)
    process.exit(1)
  }
  try {
    report(name, await sections[name]({ userId, host }))
  } catch (err) {
    // Одна недоступная секция не должна валить остальные
    failed++
    console.error(`  ${name}: ОШИБКА ${err.message}`)
  }
}

if (failed) process.exit(1)
