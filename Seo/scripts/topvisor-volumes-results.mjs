// Выгрузка результатов задачи частоты TopVisor → Seo/semantic/frequency-results.csv
import fs from 'node:fs'
import os from 'node:os'
const taskId = process.argv[2]
const env = JSON.parse(fs.readFileSync(os.homedir() + '/.claude.json', 'utf8')).mcpServers.topvisor.env
const r = await fetch('https://api.topvisor.com/v2/json/get/keywords_2/keywords', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'User-Id': env.TOPVISOR_USER_ID, Authorization: `bearer ${env.TOPVISOR_API_KEY}` },
  body: JSON.stringify({ project_id: taskId, fields: ['name', 'volume:225:0:1', 'volume:225:0:6'], limit: 10000 }),
}).then((x) => x.json())
if (!r.result) { console.log(JSON.stringify(r).slice(0, 800)); process.exit(1) }
const rows = r.result.map((k) => [k.name, k['volume:225:0:1'] ?? '', k['volume:225:0:6'] ?? ''])
const done = rows.filter((x) => x[1] !== '' && x[1] !== null).length
console.log(`rows=${rows.length} with_volume=${done}`)
if (process.argv.includes('--save')) {
  const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)
  fs.writeFileSync('Seo/semantic/frequency-results.csv', 'query,volume_broad,volume_exact\n' + rows.map((x) => x.map(esc).join(',')).join('\n') + '\n')
}
