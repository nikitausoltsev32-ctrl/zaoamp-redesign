import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const input = path.join(root, 'Seo', 'semantic', 'topvisor-collect-75599740.csv')
const output = path.join(root, 'Seo', 'semantic', 'topvisor-clean.csv')
const excludedOutput = path.join(root, 'Seo', 'semantic', 'topvisor-excluded.csv')

const parseCsvLine = (line) => {
  const values = []
  let value = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i++ } else quoted = !quoted
    } else if (char === ',' && !quoted) { values.push(value); value = '' }
    else value += char
  }
  values.push(value)
  return values
}

const lines = fs.readFileSync(input, 'utf8').trim().split(/\r?\n/)
const rows = lines.slice(1).map((line) => {
  const [id, query, groupId, groupName] = parseCsvLine(line)
  return { id, query: query.toLowerCase().trim(), groupId, groupName }
})

const excludeRules = [
  [/микроальбум|микропенис|клоп|кальцитриол|коликальциферол|кальцефорте|монофосфат|хлорид кальция|карбамид|каменное масло|500\s*мг/, 'медицина или бытовая химия'],
  [/сладкий мрамор|арбуз.*мрамор|бдо мрамор|мраморн.*кекс|рецепт|халва|сахар/, 'еда или игровой запрос'],
  [/гранитн|кварцевый песок|доломитов|известь мраморная/, 'другой материал'],
  [/жидкий мрамор|литьевой мрамор|гибкий мрамор|искусственный мрамор|венецианск|обои мрамор|мрамор текстур|текстура мрамора|каррарск|мрамор каррара/, 'другой продукт или отделочный эффект'],
  [/сковород|раковин|столешниц|сувенир|статуэт|памятник|надгроб|крест из|плитк/, 'готовое изделие, не сырьё'],
  [/могил|кладбищ/, 'розничный ритуальный сценарий'],
  [/леруа|петрович|светофор|авито|в розницу/, 'розничный канал'],
  [/брозекс|farbitex|imperial|церезит|терралит|риф микрокальцит/, 'чужой бренд или готовая смесь'],
  [/акрило[- ]?мраморн|акрилово[- ]?мраморн/, 'готовое покрытие, не сырьё'],
  [/\b(?:1|5|10|20|25|50)\s*кг\b|цена.*\bкг\b/, 'партия меньше 5 тонн'],
  [/розов|зел[её]н|син(?:ий|яя)|коричнев|сер(?:ый|ая|ого)|ч[её]рн|т[её]мн|прозрачн/, 'цвет отсутствует в ассортименте'],
  [/миксбордер|ландшафтный парк|галька для|дизайн ручь|подпорный камень/, 'общий ландшафтный запрос без продукта'],
  [/битумная эмульсия|гравий стопбан|валик для|клей для мрамора|шпаклевка под мрамор|микроцемент/, 'сопутствующий или другой продукт'],
]

const relevant = /мраморн.*(?:крош|щеб|мук|пес)|(?:крош|щеб|мук|пес).*мраморн|микрокальцит|карбонат кальция|кальций карбонат|мраморн.*наполнител|молотый мрамор/

const targetFor = (query) => {
  if (/сельск|почв|удобрен/.test(query)) return '/primenenie/selhoz/'
  if (/лкм|красок|краск|пластмасс|пвх|смол|лак /.test(query)) return '/primenenie/lkm/'
  if (/штукатур|фасад|цокол|сухих.*смес|шпакл/.test(query)) return '/primenenie/shtukaturka/'
  if (/дорог|асфальт|отсып|дренаж/.test(query)) return '/primenenie/dorogi/'
  if (/ландшафт|сад|клумб|цветник|благоустрой/.test(query)) return '/primenenie/landshaft/'
  if (/микрокальцит|карбонат кальция|кальций карбонат|мраморн.*наполнител/.test(query)) return '/product/mikrokaltsit-5-200-mkm/'
  if (/мраморн.*мук|мук.*мраморн|мраморн.*пудр/.test(query)) return '/product/mramornaya-muka-0-0-2/'
  if (/щеб/.test(query)) {
    if (/50\s*[-–]?\s*200|200\s*мм/.test(query)) return '/product/mramornyj-shheben-50-200/'
    if (/20\s*[-–]?\s*(?:40|50)|20\s+40|20\s+50/.test(query)) return '/product/mramornyj-shheben-20-50/'
    if (/(?:10|5)\s*[-–]?\s*20|10\s+20|5\s+20/.test(query)) return '/product/mramornyj-shheben-10-20/'
    return '/catalog/shcheben/'
  }
  if (/крош/.test(query)) {
    if (/0[.,]\s*2\s*[-–]?\s*0[.,]\s*5|0\.2\s+0\.5/.test(query)) return '/product/mramornaya-kroshka-0-2-0-5/'
    if (/0[.,]\s*5\s*[-–]?\s*1[.,]\s*0/.test(query)) return '/product/mramornaya-kroshka-0-5-1-0/'
    if (/1[.,]\s*0\s*[-–]?\s*1[.,]\s*5|1\s+1\s+5/.test(query)) return '/product/mramornaya-kroshka-1-0-1-5/'
    if (/1[.,]\s*5\s*[-–]?\s*2[.,]\s*0/.test(query)) return '/product/mramornaya-kroshka-1-5-2-0/'
    if (/\b2\s*[-–]?\s*3(?:\s*мм)?\b|\b2\s+3(?:\s*мм)?\b/.test(query)) return '/product/mramornaya-kroshka-2-3/'
    if (/\b5\s*[-–]?\s*10(?:\s*мм)?\b|\b5\s+10(?:\s*мм)?\b/.test(query)) return '/product/mramornaya-kroshka-5-10/'
    if (/\b0\s*[-–]?\s*1(?:\s*мм)?\b/.test(query)) return '/product/mramornaya-kroshka-0-1/'
    if (/\b0\s*[-–]?\s*5(?:\s*мм)?\b/.test(query)) return '/product/mramornaya-kroshka-0-5/'
    return '/catalog/kroshka/'
  }
  return '/catalog/'
}

const intentFor = (query) => {
  if (/купить|цена|стоим|опт|продам|поставщик|производител|заказать|тонн|биг.?б[еэ]г/.test(query)) return 'commercial'
  if (/екатеринбург|москв|челябинск|тюмен|перм|спб|санкт|област|росси|урал|краснодар|новосибирск|город/.test(query)) return 'geo'
  if (/как|что|для чего|примен|отлич|плотност|фракц|расход|сколько|виды|формула/.test(query)) return 'informational'
  return 'mixed'
}

const accepted = []
const excluded = []
for (const row of rows) {
  const blocked = excludeRules.find(([pattern]) => pattern.test(row.query))
  if (blocked) { excluded.push({ ...row, reason: blocked[1] }); continue }
  if (!relevant.test(row.query)) { excluded.push({ ...row, reason: 'нет целевого продукта' }); continue }
  accepted.push({ ...row, intent: intentFor(row.query), target: targetFor(row.query), status: 'candidate_pending_frequency' })
}

const esc = (value) => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}
const write = (file, header, data) => fs.writeFileSync(file, [header.join(','), ...data.map((row) => header.map((key) => esc(row[key])).join(','))].join('\n') + '\n', 'utf8')
write(output, ['id', 'query', 'intent', 'target', 'status'], accepted)
write(excludedOutput, ['id', 'query', 'reason'], excluded)

const targets = Object.fromEntries([...new Set(accepted.map((x) => x.target))].sort().map((target) => [target, accepted.filter((x) => x.target === target).length]))
console.log(JSON.stringify({ source: rows.length, accepted: accepted.length, excluded: excluded.length, targets }, null, 2))
