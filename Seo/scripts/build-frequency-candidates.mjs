import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const semanticDir = path.join(root, 'Seo', 'semantic')

const parseCsv = (file) => {
  const text = fs.readFileSync(file, 'utf8').trim()
  const records = []
  let record = [], value = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { value += '"'; i++ } else quoted = !quoted
    } else if (char === ',' && !quoted) { record.push(value); value = '' }
    else if (char === '\n' && !quoted) { record.push(value.replace(/\r$/, '')); records.push(record); record = []; value = '' }
    else value += char
  }
  record.push(value.replace(/\r$/, '')); records.push(record)
  const header = records.shift()
  return records.filter((row) => row.some(Boolean)).map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ''])))
}

const clean = parseCsv(path.join(semanticDir, 'topvisor-clean.csv'))
const core = parseCsv(path.join(semanticDir, 'core.csv'))
const observed = parseCsv(path.join(semanticDir, 'observed.csv'))

const businessExclude = /гранит|цементная крошка|акрило[- ]?мраморн|флорист|\b(?:1|5|10|20|25|50)\s*кг\b|леруа|петрович|светофор|авито|в розницу|могил|кладбищ|памятник|надгроб|макрощел|рецепт|халва|сковород|раковин|столешниц/
const relevant = /мраморн.*(?:крош|щеб|мук|пес)|(?:крош|щеб|мук|пес).*мраморн|микрокальцит|карбонат кальция|кальций карбонат|мраморн.*наполнител|молотый мрамор|карьер.*мрамор|производ.*мрамор/

const merged = new Map()
const add = ({ query, source, id = '', intent = '', target = '', evidence = '' }) => {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!normalized) return
  if (!merged.has(normalized)) merged.set(normalized, { query: normalized, topvisor_id: '', sources: new Set(), intent: '', target: '', evidence: '' })
  const row = merged.get(normalized)
  row.sources.add(source)
  if (id) row.topvisor_id = id
  if (intent && (!row.intent || source === 'core_seed')) row.intent = intent
  if (target && (!row.target || source === 'core_seed')) row.target = target
  if (evidence) row.evidence = [row.evidence, evidence].filter(Boolean).join('|')
}

for (const row of clean) add({ ...row, source: 'topvisor_collect', id: row.id })
for (const row of core) add({ query: row.query, source: 'core_seed', intent: row.intent, target: row.current_url })
for (const row of observed) {
  if (row.status !== 'candidate' || businessExclude.test(row.query) || !relevant.test(row.query)) continue
  const evidence = [
    row.gsc_impressions ? `gsc:${row.gsc_impressions}` : '',
    row.yandex_shows ? `yandex:${row.yandex_shows}` : '',
  ].filter(Boolean).join('|')
  add({ query: row.query, source: row.sources, evidence })
}

const rows = [...merged.values()].map((row) => ({
  query: row.query,
  topvisor_id: row.topvisor_id,
  sources: [...row.sources].sort().join('|'),
  intent: row.intent || 'review',
  target: row.target,
  evidence: row.evidence,
  status: 'pending_wordstat_frequency',
})).sort((a, b) => {
  const aSeed = a.sources.includes('core_seed') ? 1 : 0
  const bSeed = b.sources.includes('core_seed') ? 1 : 0
  return bSeed - aSeed || a.query.localeCompare(b.query, 'ru')
})

const esc = (value) => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}
const header = ['query', 'topvisor_id', 'sources', 'intent', 'target', 'evidence', 'status']
const csv = [header.join(','), ...rows.map((row) => header.map((key) => esc(row[key])).join(','))].join('\n') + '\n'
const outFile = path.join(semanticDir, 'frequency-candidates.csv')
fs.writeFileSync(outFile, csv, 'utf8')

if (process.argv.includes('--keywords-json')) {
  console.log(JSON.stringify(rows.map((row) => row.query)))
} else {
  console.log(JSON.stringify({
    total: rows.length,
    coreSeeds: rows.filter((row) => row.sources.includes('core_seed')).length,
    observed: rows.filter((row) => row.sources.includes('gsc') || row.sources.includes('yandex_webmaster')).length,
    withoutTopvisorId: rows.filter((row) => !row.topvisor_id).length,
    outFile,
  }, null, 2))
}
