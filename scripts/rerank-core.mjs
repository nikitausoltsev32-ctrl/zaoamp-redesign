import { readFileSync } from 'node:fs'

const KEY = process.env.OPENROUTER_API_KEY
const src = readFileSync(new URL('../lib/data/semantic-core.ts', import.meta.url), 'utf8')
const queries = [...src.matchAll(/query:\s*'([^']+)'/g)].map((m) => m[1])

const seed =
  'коммерческий запрос B2B: купить от производителя оптом мраморный щебень крошку муку микрокальцит, цена за тонну, доставка'

const res = await fetch('https://openrouter.ai/api/v1/rerank', {
  method: 'POST',
  headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'cohere/rerank-4-pro', query: seed, documents: queries, top_n: queries.length }),
})
const data = await res.json()
if (!data.results) {
  console.error(JSON.stringify(data, null, 2))
  process.exit(1)
}
for (const r of data.results) {
  console.log(`${r.relevance_score.toFixed(3)}\t${queries[r.index]}`)
}
console.error(`\nusage: ${JSON.stringify(data.usage)} provider=${data.provider}`)
