// get|go: цена / запуск проверки частоты (Яндекс, Россия, общая + [!точная]) для списка из JSON.
// Ключи берутся из MCP-конфига topvisor в ~/.claude.json.
import fs from 'node:fs'
import os from 'node:os'
const [mode, file] = process.argv.slice(2)
const env = JSON.parse(fs.readFileSync(os.homedir() + '/.claude.json', 'utf8')).mcpServers.topvisor.env
const keywords = JSON.parse(fs.readFileSync(file, 'utf8'))
const call = async (op, method, body) => {
  const r = await fetch(`https://api.topvisor.com/v2/json/${op}/projects_2/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Id': env.TOPVISOR_USER_ID, Authorization: `bearer ${env.TOPVISOR_API_KEY}` },
    body: JSON.stringify(body),
  })
  return r.json()
}
const qualifiers = [{ region_key: 225, searcher_key: 0, type: 1 }, { region_key: 225, searcher_key: 0, type: 6 }]
const res = mode === 'go'
  ? await call('add', 'tasks/volumes', { keywords, qualifiers })
  : await call('get', 'tasks/volumes/price', { keywords, qualifiers })
console.log(`keywords=${keywords.length}`, JSON.stringify(res, null, 1).slice(0, 1500))
