import { chromium } from 'playwright'
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { readTopics, markStatus, writeTopics } from './lib/topics.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SESSION = join(__dirname, '.dzen-session.json')
const DZEN_DIR = join(__dirname, '..', 'content', 'dzen')

function parseArticle(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) throw new Error('Нет frontmatter')
  const fm = Object.fromEntries(
    m[1].split('\n').filter((l) => /^\w+:/.test(l)).map((l) => {
      const i = l.indexOf(':')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]
    })
  )
  return { fm, body: m[2] }
}

function findGenerated() {
  const files = readdirSync(DZEN_DIR).filter((f) => f.endsWith('.md')).sort()
  for (const f of files) {
    const full = join(DZEN_DIR, f)
    const { fm, body } = parseArticle(readFileSync(full, 'utf8'))
    if (fm.status === 'generated') return { full, file: f, fm, body }
  }
  return null
}

async function main() {
  if (!existsSync(SESSION)) {
    console.error('Нет сессии. Залогинься: npx playwright open --save-storage=scripts/.dzen-session.json https://dzen.ru')
    process.exit(1)
  }
  const article = findGenerated()
  if (!article) {
    console.log('Нет статей со статусом generated в content/dzen/')
    return
  }
  const { fm, body } = article
  console.log(`Публикую: ${fm.title}`)

  const browser = await chromium.launch({ headless: false, slowMo: 120 })
  const ctx = await browser.newContext({ storageState: SESSION })
  const page = await ctx.newPage()
  await page.goto('https://dzen.ru/profile/editor/id/6a391d4fd0b41a3347041428')

  // Антибот-проверка: если просят капчу — стоп
  if (await page.locator('text=/captcha|подтвердите|robot/i').count()) {
    console.error('Замечена антибот-проверка. Останавливаюсь — опубликуй вручную.')
    await browser.close()
    process.exit(2)
  }

  console.log('Редактор открыт. Вставь заголовок и текст вручную в открытом окне,')
  console.log('либо доработай селекторы под текущий UI Дзена, затем нажми Enter здесь.')
  console.log('--- ЗАГОЛОВОК ---\n' + fm.title)
  console.log('--- ТЕКСТ ---\n' + body)

  await page.pause() // ручной контроль публикации

  const url = await page.url()

  // Записать статус в сам .md файл статьи, иначе findGenerated() выберет её снова → дубль-постинг
  const raw = readFileSync(article.full, 'utf8')
  const updated = raw
    .replace(/^status: generated$/m, 'status: published')
    .replace(/^url:.*$/m, `url: ${url}`)
  writeFileSync(article.full, updated)

  // И обновить очередь тем, если тема нашлась по заголовку
  const slug = findSlug(fm)
  if (slug) {
    const data = readTopics()
    markStatus(data, slug, 'published', { url })
    writeTopics(data)
  } else {
    console.warn(`Тема для «${fm.title}» не найдена в topics.json — обновлён только файл статьи.`)
  }
  await browser.close()
}

function findSlug(fm) {
  const data = readTopics()
  const t = data.queue.find((q) => q.title === fm.title)
  return t ? t.slug : ''
}

main().catch((e) => { console.error(e); process.exit(1) })
