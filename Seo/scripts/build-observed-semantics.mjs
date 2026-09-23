import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dataDir = path.join(root, 'Seo', 'data', '2026-09-21')
const outFile = path.join(root, 'Seo', 'semantic', 'observed.csv')

const gsc = JSON.parse(fs.readFileSync(path.join(dataDir, 'gsc-queries.json'), 'utf8'))
const yandex = JSON.parse(fs.readFileSync(path.join(dataDir, 'yandex-queries.json'), 'utf8'))

// Снимок существующего проекта TopVisor #32272062 на 21.09.2026.
const topvisor = [
  'мраморная крошка купить', 'мраморная крошка цена', 'мраморная крошка оптом',
  'мраморная крошка в мешках', 'белая мраморная крошка купить',
  'декоративная мраморная крошка', 'мраморная крошка для ландшафтного дизайна',
  'мраморная крошка 5-10', 'мраморная крошка 10-20', 'мраморная крошка 20-50',
  'мраморный щебень купить', 'белый мраморный щебень', 'мраморный щебень цена',
  'мраморный щебень оптом', 'мраморный щебень в мешках', 'мраморный щебень 10-20',
  'мраморный щебень 20-40', 'декоративный мраморный щебень',
  'галтованный мраморный щебень', 'мраморная мука купить',
  'мраморная мука микрокальцит', 'микрокальцит купить', 'микрокальцит оптом',
  'коллоидный микрокальцит', 'микрокальцит купить оптом от производителя',
  'поставщик мраморной крошки', 'производитель мраморного щебня',
  'мраморная крошка для отделки фасада', 'мраморная крошка для бетона',
  'мраморный щебень для бетона', 'белый мрамор купить', 'амп минералс', 'amp-minerals',
]

const rows = new Map()
const get = (query) => {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!rows.has(normalized)) rows.set(normalized, {
    query: normalized,
    sources: new Set(),
    gsc_impressions: '', gsc_clicks: '', gsc_position: '',
    yandex_shows: '', yandex_clicks: '', yandex_position: '',
    status: 'review', reason: '',
  })
  return rows.get(normalized)
}

for (const item of gsc.rows ?? []) {
  const row = get(item.keys[0])
  row.sources.add('gsc')
  row.gsc_impressions = item.impressions
  row.gsc_clicks = item.clicks
  row.gsc_position = Number(item.position).toFixed(2)
}

for (const item of yandex.queries ?? []) {
  const row = get(item.query_text)
  row.sources.add('yandex_webmaster')
  row.yandex_shows = item.indicators.TOTAL_SHOWS
  row.yandex_clicks = item.indicators.TOTAL_CLICKS
  row.yandex_position = item.indicators.AVG_SHOW_POSITION == null
    ? '' : Number(item.indicators.AVG_SHOW_POSITION).toFixed(2)
}

for (const query of topvisor) get(query).sources.add('topvisor_existing')

const hardExclude = [
  [/гранитн/, 'чужой материал: гранит'],
  [/цементная крошка/, 'чужой материал'],
  [/макрощел/, 'нерелевантный запрос'],
  [/флористик/, 'розничный сценарий'],
  [/\b5\s*кг\b/, 'заказ меньше 5 тонн'],
  [/акрило[- ]?мраморн/, 'другой продукт'],
]

for (const row of rows.values()) {
  const match = hardExclude.find(([pattern]) => pattern.test(row.query))
  if (match) {
    row.status = 'exclude'
    row.reason = match[1]
  } else if (/амп|amp|evoprod|телефон|79193931992|89193931992/.test(row.query)) {
    row.status = 'brand'
    row.reason = 'брендовый или навигационный запрос'
  } else {
    row.status = 'candidate'
  }
}

const esc = (value) => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

const header = [
  'query', 'sources', 'gsc_impressions', 'gsc_clicks', 'gsc_position',
  'yandex_shows', 'yandex_clicks', 'yandex_position', 'status', 'reason',
]
const sorted = [...rows.values()].sort((a, b) => {
  const demandA = Number(a.gsc_impressions || 0) + Number(a.yandex_shows || 0)
  const demandB = Number(b.gsc_impressions || 0) + Number(b.yandex_shows || 0)
  return demandB - demandA || a.query.localeCompare(b.query, 'ru')
})

const csv = [header.join(','), ...sorted.map((row) => [
  row.query, [...row.sources].sort().join('|'), row.gsc_impressions, row.gsc_clicks,
  row.gsc_position, row.yandex_shows, row.yandex_clicks, row.yandex_position,
  row.status, row.reason,
].map(esc).join(','))].join('\n') + '\n'

fs.writeFileSync(outFile, csv, 'utf8')
console.log(JSON.stringify({ total: sorted.length,
  candidates: sorted.filter((x) => x.status === 'candidate').length,
  excluded: sorted.filter((x) => x.status === 'exclude').length,
  brand: sorted.filter((x) => x.status === 'brand').length,
  outFile,
}, null, 2))
