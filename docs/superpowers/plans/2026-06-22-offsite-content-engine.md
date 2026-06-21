# Офсайт-контент движок Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Система автогенерации B2B-статей в очередь файлов + полуавтоматический постинг в Дзен с локальной машины, для наращивания ссылочного авторитета amp-minerals.ru.

**Architecture:** Очередь тем в `content/topics.json` — источник правды. Чистые `.mjs`-модули (`scripts/lib/`) управляют очередью и пишут markdown-файлы статей с frontmatter. Облачный агент `/schedule` вызывает эти модули, пишет прозу, пушит в ветку `content/auto`. Отдельный Playwright-скрипт (`scripts/dzen-post.mjs`) постит с локальной машины.

**Tech Stack:** Node 24 (ESM `.mjs`), нативный `node:test` + `node:assert`, Playwright (новая зависимость, только для эксперимента B).

## Global Constraints

- Runtime: Node 24, модули в формате ESM `.mjs` (проект `type: commonjs`, поэтому расширение `.mjs` обязательно).
- Тесты: нативный `node:test` + `node:assert/strict`, как в `lib/ai/lead.test.ts`. Запуск `node --test`.
- Ветка автопуша агента: `content/auto` (НЕ `main`).
- Темп публикации: 2 статьи/неделю в Дзен.
- Аудитория статей: B2B (снабженцы, прорабы, технологи) + строители.
- В каждой статье 1–2 контекстные ссылки на `amp-minerals.ru`.
- Реальные числа из паспортов: белизна 98%, CaCO₃ 98%, Аэфф 72 Бк/кг.
- Slug товаров для backlink'ов (реальные, из `lib/data/products.ts`): `mramornaya-kroshka-5-10`, `mramornaya-kroshka-0-5`, `mramornaya-muka-0-0-2`, `mikrokaltsit-5-200-mkm`. Категории: `/catalog/kroshka`, `/catalog/shcheben`, `/catalog/muka`.

---

## File Structure

- `content/topics.json` — очередь тем (источник правды).
- `content/dzen/`, `content/vc/`, `content/habr/` — папки готовых статей (создаются с `.gitkeep`).
- `scripts/lib/topics.mjs` — чтение очереди, выбор следующей темы, смена статуса.
- `scripts/lib/topics.test.mjs` — тесты очереди.
- `scripts/lib/article.mjs` — построение пути файла, frontmatter, запись статьи.
- `scripts/lib/article.test.mjs` — тесты записи статьи.
- `scripts/dzen-post.mjs` — Playwright-постинг (эксперимент B, локально).
- `docs/superpowers/content-agent-prompt.md` — инструкция для облачного `/schedule` агента.
- `package.json` — добавить скрипты `test` и `post:dzen`.

---

### Task 1: Очередь тем — данные и модуль `topics.mjs`

**Files:**
- Create: `content/topics.json`
- Create: `content/dzen/.gitkeep`, `content/vc/.gitkeep`, `content/habr/.gitkeep`
- Create: `scripts/lib/topics.mjs`
- Test: `scripts/lib/topics.test.mjs`

**Interfaces:**
- Consumes: ничего.
- Produces:
  - `readTopics(path?: string) => { queue: Topic[] }`
  - `selectNextPending(data, platform: string) => Topic | null` — первая тема со `status: 'pending'` и нужной `platform`, или `null`.
  - `markStatus(data, slug: string, status: string, fields?: object) => data` — меняет статус темы по slug, мержит доп. поля (`url`, `published_at`); мутирует и возвращает `data`. Бросает `Error`, если slug не найден.
  - `writeTopics(data, path?: string) => void` — пишет JSON обратно (2 пробела, перевод строки в конце).
  - Тип `Topic = { slug, title, platform, audience, status }`.

- [ ] **Step 1: Создать seed-файл очереди**

`content/topics.json`:

```json
{
  "queue": [
    {
      "slug": "mramornaya-kroshka-dlya-shtukaturki-rashod",
      "title": "Мраморная крошка для декоративной штукатурки: фракции, расход, выбор поставщика",
      "platform": "dzen",
      "audience": "b2b",
      "status": "pending"
    },
    {
      "slug": "mikrokaltsit-v-proizvodstve-lkm",
      "title": "Микрокальцит в производстве ЛКМ: какой брать и на что смотреть в паспорте",
      "platform": "dzen",
      "audience": "b2b",
      "status": "pending"
    },
    {
      "slug": "mramornyj-shheben-dlya-dorog-i-blagoustrojstva",
      "title": "Мраморный щебень для дорог и благоустройства: фракции и приёмка партии",
      "platform": "dzen",
      "audience": "builders",
      "status": "pending"
    },
    {
      "slug": "kak-prinyat-partiyu-mramornoj-kroshki-na-obekte",
      "title": "Как снабженцу принять партию мраморной крошки: что проверять кроме цены",
      "platform": "vc",
      "audience": "b2b",
      "status": "pending"
    }
  ]
}
```

- [ ] **Step 2: Создать пустые папки статей**

Создать файлы `content/dzen/.gitkeep`, `content/vc/.gitkeep`, `content/habr/.gitkeep` (пустые), чтобы git отслеживал папки.

- [ ] **Step 3: Написать падающий тест**

`scripts/lib/topics.test.mjs`:

```javascript
import assert from 'node:assert/strict'
import test from 'node:test'
import { selectNextPending, markStatus } from './topics.mjs'

const fixture = () => ({
  queue: [
    { slug: 'a', title: 'A', platform: 'dzen', audience: 'b2b', status: 'generated' },
    { slug: 'b', title: 'B', platform: 'vc', audience: 'b2b', status: 'pending' },
    { slug: 'c', title: 'C', platform: 'dzen', audience: 'b2b', status: 'pending' },
  ],
})

test('selectNextPending returns first pending topic for the platform', () => {
  const t = selectNextPending(fixture(), 'dzen')
  assert.equal(t.slug, 'c')
})

test('selectNextPending returns null when none pending for platform', () => {
  const data = { queue: [{ slug: 'a', platform: 'dzen', status: 'generated' }] }
  assert.equal(selectNextPending(data, 'dzen'), null)
})

test('markStatus updates status and merges extra fields by slug', () => {
  const data = fixture()
  markStatus(data, 'c', 'published', { url: 'https://dzen.ru/a/x' })
  const topic = data.queue.find((q) => q.slug === 'c')
  assert.equal(topic.status, 'published')
  assert.equal(topic.url, 'https://dzen.ru/a/x')
})

test('markStatus throws on unknown slug', () => {
  assert.throws(() => markStatus(fixture(), 'zzz', 'published'))
})
```

- [ ] **Step 4: Запустить тест — убедиться, что падает**

Run: `node --test scripts/lib/topics.test.mjs`
Expected: FAIL — `Cannot find module './topics.mjs'` / `selectNextPending is not a function`.

- [ ] **Step 5: Написать модуль**

`scripts/lib/topics.mjs`:

```javascript
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_PATH = join(__dirname, '..', '..', 'content', 'topics.json')

export function readTopics(path = DEFAULT_PATH) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function selectNextPending(data, platform) {
  return data.queue.find((t) => t.status === 'pending' && t.platform === platform) ?? null
}

export function markStatus(data, slug, status, fields = {}) {
  const topic = data.queue.find((t) => t.slug === slug)
  if (!topic) throw new Error(`Topic not found: ${slug}`)
  topic.status = status
  Object.assign(topic, fields)
  return data
}

export function writeTopics(data, path = DEFAULT_PATH) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
}
```

- [ ] **Step 6: Запустить тест — убедиться, что проходит**

Run: `node --test scripts/lib/topics.test.mjs`
Expected: PASS (4 теста).

- [ ] **Step 7: Коммит**

```bash
git add content/topics.json content/dzen/.gitkeep content/vc/.gitkeep content/habr/.gitkeep scripts/lib/topics.mjs scripts/lib/topics.test.mjs
git commit -m "feat(content): topics queue data and management module"
```

---

### Task 2: Запись статьи — модуль `article.mjs`

**Files:**
- Create: `scripts/lib/article.mjs`
- Test: `scripts/lib/article.test.mjs`

**Interfaces:**
- Consumes: тип `Topic` из Task 1.
- Produces:
  - `buildFrontmatter(topic, { backlinks }) => string` — YAML-блок между `---`, поля: title, platform, audience, status `generated`, backlinks (массив), пустые `published_at:` и `url:`.
  - `articleFilePath(topic, date: string) => string` — относительный путь `content/{platform}/{date}-{slug}.md`.
  - `writeArticle(topic, { date, backlinks, body }, root?) => string` — пишет файл `frontmatter + '\n' + body + '\n'`, возвращает абсолютный путь.

- [ ] **Step 1: Написать падающий тест**

`scripts/lib/article.test.mjs`:

```javascript
import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, readFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildFrontmatter, articleFilePath, writeArticle } from './article.mjs'

const topic = { slug: 'test-slug', title: 'Тест', platform: 'dzen', audience: 'b2b', status: 'pending' }

test('buildFrontmatter sets status generated and lists backlinks', () => {
  const fm = buildFrontmatter(topic, { backlinks: ['https://amp-minerals.ru/catalog/kroshka'] })
  assert.match(fm, /^---/)
  assert.match(fm, /status: generated/)
  assert.match(fm, /platform: dzen/)
  assert.match(fm, /https:\/\/amp-minerals\.ru\/catalog\/kroshka/)
  assert.match(fm, /published_at:/)
  assert.match(fm, /url:/)
})

test('articleFilePath uses platform folder, date and slug', () => {
  assert.equal(articleFilePath(topic, '2026-06-25'), 'content/dzen/2026-06-25-test-slug.md')
})

test('writeArticle writes frontmatter and body to disk', () => {
  const root = mkdtempSync(join(tmpdir(), 'art-'))
  mkdirSync(join(root, 'content', 'dzen'), { recursive: true })
  const path = writeArticle(topic, { date: '2026-06-25', backlinks: [], body: '# Привет\n\nТекст.' }, root)
  const content = readFileSync(path, 'utf8')
  assert.match(content, /status: generated/)
  assert.match(content, /# Привет/)
})
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `node --test scripts/lib/article.test.mjs`
Expected: FAIL — `Cannot find module './article.mjs'`.

- [ ] **Step 3: Написать модуль**

`scripts/lib/article.mjs`:

```javascript
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

export function buildFrontmatter(topic, { backlinks = [] } = {}) {
  const lines = [
    '---',
    `title: "${topic.title.replace(/"/g, '\\"')}"`,
    `platform: ${topic.platform}`,
    `audience: ${topic.audience}`,
    'status: generated',
    'backlinks:',
    ...backlinks.map((b) => `  - "${b}"`),
    'published_at:',
    'url:',
    '---',
  ]
  return lines.join('\n')
}

export function articleFilePath(topic, date) {
  return `content/${topic.platform}/${date}-${topic.slug}.md`
}

export function writeArticle(topic, { date, backlinks = [], body }, root = process.cwd()) {
  const rel = articleFilePath(topic, date)
  const abs = join(root, rel)
  writeFileSync(abs, buildFrontmatter(topic, { backlinks }) + '\n' + body + '\n')
  return abs
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `node --test scripts/lib/article.test.mjs`
Expected: PASS (3 теста).

- [ ] **Step 5: Добавить скрипт `test` в package.json**

В `package.json`, блок `scripts`, добавить строку после `"type-check"`:

```json
    "test": "node --test scripts/lib"
```

- [ ] **Step 6: Запустить все тесты**

Run: `npm test`
Expected: PASS — 7 тестов (4 из Task 1 + 3 из Task 2).

- [ ] **Step 7: Коммит**

```bash
git add scripts/lib/article.mjs scripts/lib/article.test.mjs package.json
git commit -m "feat(content): article file writer with frontmatter"
```

---

### Task 3: Инструкция для облачного `/schedule` агента

**Files:**
- Create: `docs/superpowers/content-agent-prompt.md`

**Interfaces:**
- Consumes: `selectNextPending`, `markStatus`, `writeTopics` (Task 1), `writeArticle` (Task 2).
- Produces: текстовая инструкция (промпт), не код. Тестируется чтением, не автотестом.

- [ ] **Step 1: Написать промпт-инструкцию**

`docs/superpowers/content-agent-prompt.md`:

````markdown
# Промпт для облачного агента генерации статей

Запуск: `/schedule`, 2 раза в неделю. Агент работает в облаке, пушит в ветку `content/auto`.

## Алгоритм

1. `git checkout content/auto` (создать от `main`, если ветки нет: `git checkout -b content/auto main`).
2. В Node прочитать очередь и выбрать тему:

   ```js
   import { readTopics, selectNextPending, markStatus, writeTopics } from '../scripts/lib/topics.mjs'
   const data = readTopics()
   const topic = selectNextPending(data, 'dzen')
   ```

   Если `topic === null` — взять `selectNextPending(data, 'vc')`, затем `'habr'`.
   Если везде `null` — остановиться, написать «очередь пуста, добавьте темы в content/topics.json».

3. Написать статью по теме `topic.title`. Требования к тексту:
   - B2B-стиль: практическая польза (расход, фракции, технология, приёмка партии,
     выбор поставщика). Без воды и кликбейта.
   - Реальные числа из паспортов: белизна 98%, CaCO₃ 98%, Аэфф 72 Бк/кг.
   - 1–2 контекстные ссылки на amp-minerals.ru в теле (не списком в конце).
     Выбрать релевантные теме URL из:
     `/catalog/kroshka`, `/catalog/shcheben`, `/catalog/muka`,
     `/product/mramornaya-kroshka-5-10`, `/product/mramornaya-muka-0-0-2`,
     `/product/mikrokaltsit-5-200-mkm`.
   - Объём 4000–7000 знаков.

4. Записать файл и обновить очередь:

   ```js
   import { writeArticle } from '../scripts/lib/article.mjs'
   const date = new Date().toISOString().slice(0, 10)
   writeArticle(topic, { date, backlinks: [/* выбранные URL */], body: /* markdown статьи */ })
   markStatus(data, topic.slug, 'generated')
   writeTopics(data)
   ```

5. Коммит и пуш:

   ```bash
   git add content/
   git commit -m "content: статья «<title>» (<platform>)"
   git push origin content/auto
   ```

6. Сообщить пользователю: какая тема написана, путь файла, какие backlinks вставлены.

## Что НЕ делать
- Не пушить в `main`.
- Не публиковать на площадках (постинг отдельно).
- Не выдумывать характеристики продукции сверх паспортных.
````

- [ ] **Step 2: Коммит**

```bash
git add docs/superpowers/content-agent-prompt.md
git commit -m "docs(content): scheduled agent prompt for article generation"
```

---

### Task 4: Эксперимент B — Playwright-постинг `dzen-post.mjs`

**Files:**
- Create: `scripts/dzen-post.mjs`
- Modify: `package.json` (скрипт `post:dzen`, devDependency `playwright`)
- Create: `.gitignore` запись для `scripts/.dzen-session.json`

**Interfaces:**
- Consumes: `readTopics`, `markStatus`, `writeTopics` (Task 1); файлы `content/dzen/*.md` со `status: generated`.
- Produces: исполняемый скрипт, запуск `npm run post:dzen`. Без автотестов (интеграция с внешним UI; проверяется ручным прогоном).

**ВАЖНО (security):** скрипт логинится в реальный аккаунт Дзена. Сессия (`storageState`)
сохраняется локально и обязана быть в `.gitignore` — это секрет, в репозиторий не коммитить.

- [ ] **Step 1: Установить Playwright как devDependency**

Run: `npm install -D playwright`
Затем установить браузер: `npx playwright install chromium`
Expected: playwright появился в `devDependencies` package.json.

- [ ] **Step 2: Добавить сессию в .gitignore**

В `.gitignore` добавить строку:

```
scripts/.dzen-session.json
```

- [ ] **Step 3: Написать скрипт постинга**

`scripts/dzen-post.mjs`:

```javascript
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
  await page.goto('https://dzen.ru/profile/editor')

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
  const data = readTopics()
  markStatus(data, fm.title ? findSlug(fm) : '', 'published', { url })
  writeTopics(data)
  await browser.close()
}

function findSlug(fm) {
  const data = readTopics()
  const t = data.queue.find((q) => q.title === fm.title)
  return t ? t.slug : ''
}

main().catch((e) => { console.error(e); process.exit(1) })
```

- [ ] **Step 4: Добавить npm-скрипт**

В `package.json`, блок `scripts`, добавить:

```json
    "post:dzen": "node scripts/dzen-post.mjs"
```

- [ ] **Step 5: Проверить запуск без сессии (smoke)**

Run: `npm run post:dzen`
Expected: вывод «Нет сессии. Залогинься…» и выход с кодом 1 (т.к. `scripts/.dzen-session.json` ещё нет). Это подтверждает, что скрипт грузится и логика проверки сессии работает.

- [ ] **Step 6: Коммит**

```bash
git add scripts/dzen-post.mjs package.json package-lock.json .gitignore
git commit -m "feat(content): experimental local Playwright posting to Dzen"
```

---

## Self-Review

**Spec coverage:**
- Очередь тем `topics.json` → Task 1 ✅
- Генератор (выбор темы, запись файла, статусы) → Task 1 + Task 2 (механика) + Task 3 (промпт агента) ✅
- Формат файла статьи (frontmatter) → Task 2 ✅
- Пуш в `content/auto` → Task 3, шаг 1 и 5 ✅
- Эксперимент B (Playwright локально) → Task 4 ✅
- Папки `content/{dzen,vc,habr}` → Task 1, шаг 2 ✅
- npm-скрипт `post:dzen` → Task 4 ✅
- Измерение успеха (Вебмастер/GSC/Метрика) — ручной мониторинг, кода не требует, остаётся в спеке ✅

**Placeholder scan:** код приведён полностью во всех шагах; промпт агента содержит реальные URL и числа. Плейсхолдеров-заглушек нет.

**Type consistency:** `selectNextPending(data, platform)`, `markStatus(data, slug, status, fields)`, `writeTopics(data, path)`, `readTopics(path)`, `writeArticle(topic, opts, root)`, `buildFrontmatter(topic, opts)`, `articleFilePath(topic, date)` — имена и сигнатуры совпадают между Task 1/2 и потребителями в Task 3/4.

**Известное ограничение:** селекторы редактора Дзена в Task 4 не фиксированы (UI меняется, публичной доки нет) — скрипт намеренно открывает `page.pause()` для ручного контроля. Это осознанный компромисс эксперимента B, не плейсхолдер.
