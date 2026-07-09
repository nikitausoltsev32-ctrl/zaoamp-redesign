# AI Assistant Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Поднять конверсию AI-ассистента в лиды: быстрее отвечает, продаёт позиционирование производителя, не теряет лиды, помнит диалог, даёт воронку в Метрике, чище UX.

**Architecture:** Ассистент — Next.js 14 App Router: виджет `components/ai/ai-assistant-widget.tsx` → API `app/api/ai-assistant/route.ts` → `lib/ai/assistant.ts` (Groq → Gemini → rule-based fallback) + `lib/ai/lead.ts` (regex-обогащение лида) + `lib/ai/web-context.ts` (Tavily/Brave). Лиды сейчас уходят только в Telegram. План не меняет архитектуру — точечно правит промпт, гейтинг веб-поиска, добавляет JSONL-персистентность лидов, localStorage-персистентность диалога, стадии воронки в ответе API и упрощает футер виджета.

**Tech Stack:** Next.js 14.1 (App Router, TS), Tailwind, framer-motion, Groq API (llama-3.3-70b), Yandex Metrika (`ymGoal` из `lib/analytics`).

## Global Constraints

- В проекте НЕТ юнит-тестов для TS (`npm test` гоняет только `scripts/lib/*.test.mjs`). Верификация каждой задачи: `npm run type-check` (ожидаемо exit 0) + ручная проверка через dev-сервер/curl, как расписано в шагах.
- Числа спецификаций — только из паспортов (`memory/product_specs.md`): белизна 98%, CaCO₃ 98%, Аэфф 72 Бк/кг. Не выдумывать новые.
- Позиционирование: «производитель с собственным карьером» (см. CLAUDE.md проекта). Все тексты промпта — в этом ключе.
- Коммит после каждой задачи. Не пушить.
- Не трогать `lib/ai/knowledge.ts` (база знаний каталога) — там уже есть карьер/производитель.
- Язык всех пользовательских строк — русский.

---

### Task 1: Убрать лишний веб-поиск и срезать латентность генерации

Слова «сейчас», «сегодня» в `INTERNET_INTENT_PATTERN` запускают Tavily/Brave (до 7 сек) на бытовых фразах («нужна крошка сейчас»). Плюс `max_tokens: 900` — избыточно для ответа в 2–3 предложения.

**Files:**
- Modify: `lib/ai/web-context.ts:19-20`
- Modify: `lib/ai/assistant.ts:316,368` (max_tokens / maxOutputTokens)

**Interfaces:**
- Consumes: ничего из других задач.
- Produces: ничего — поведенческое изменение, сигнатуры не меняются.

- [ ] **Step 1: Ужесточить паттерн интернет-интента**

В `lib/ai/web-context.ts` заменить:

```ts
const INTERNET_INTENT_PATTERN =
  /(интернет|найди|поищи|проверь|актуальн|сейчас|сегодня|новост|рынок|конкурент|сравни|гост|санпин|норматив|тренд|поставщик|дилер|цена на рынке)/i
```

на:

```ts
const INTERNET_INTENT_PATTERN =
  /(в интернете|найди|поищи|провер(?:ь|ите) (?:в интернете|по ссылке|источник)|актуальн|новост|рынок|конкурент|сравни с|гост|санпин|норматив|цена на рынке)/i
```

- [ ] **Step 2: Срезать лимит токенов**

В `lib/ai/assistant.ts` в `callGroq` заменить `max_tokens: 900` на `max_tokens: 500`. В `callGemini` заменить `maxOutputTokens: 900` на `maxOutputTokens: 500`.

- [ ] **Step 3: Проверить типы**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Проверить гейтинг вручную**

Запустить `npm run dev`, затем:

```bash
curl -s http://localhost:3000/api/ai-assistant -X POST -H "Content-Type: application/json" -d '{"sessionId":"test-gate","messages":[{"role":"user","content":"нужна крошка сейчас, 5 тонн в Казань"}],"pagePath":"/"}'
```

Expected: JSON-ответ БЕЗ поля `sources` с элементами (пустой массив), ответ приходит заметно быстрее (~2-4 сек, без 7-сек паузы веб-поиска). Фраза «сравни с гранитом по ГОСТ» — наоборот, должна дать sources (если ключ Tavily/Brave настроен).

- [ ] **Step 5: Commit**

```bash
git add lib/ai/web-context.ts lib/ai/assistant.ts
git commit -m "perf(ai): tighten internet-intent gating, cut max_tokens to 500"
```

---

### Task 2: Промпт — позиционирование производителя и паспорта качества как УТП

System prompt не упоминает собственный карьер/месторождение/2004 год и прямо запрещает говорить о паспортах качества, хотя паспорта на каждую партию — реальное УТП (CLAUDE.md проекта).

**Files:**
- Modify: `lib/ai/assistant.ts:85-104` (функция `systemPrompt`)

**Interfaces:**
- Consumes: ничего.
- Produces: ничего — меняется только текст промпта.

- [ ] **Step 1: Обновить вводную и правила промпта**

В `lib/ai/assistant.ts` в функции `systemPrompt` заменить первый абзац:

```ts
  return `Ты Алекс — живой AI-менеджер продаж ЗАО АМП. Компания производит мраморную крошку, щебень, мраморную муку и микрокальцит. Работаешь с B2B клиентами: строители, ландшафтники, производители.
```

на:

```ts
  return `Ты Алекс — живой AI-менеджер продаж ЗАО АМП. Мы ПРОИЗВОДИТЕЛЬ с собственным карьером белого мрамора в Челябинской области, работаем с 2004 года (20+ лет). Производим мраморную крошку, щебень, мраморную муку и микрокальцит. На каждую партию выдаём паспорт качества. Отгрузка навалом, в биг-бэгах и мешках; доставка по РФ, Беларуси и Казахстану. Работаешь с B2B клиентами: строители, ландшафтники, производители.
Это позиционирование — твоё главное преимущество перед перекупщиками: упоминай карьер и статус производителя, когда это уместно (вопросы о качестве, цене, надёжности, документах).
```

- [ ] **Step 2: Исправить правило про паспорта**

В том же промпте заменить строку:

```ts
- Не выдумывай скидки, сертификаты, паспорта качества. По документам: "менеджер подтвердит доступные паспорта под партию".
```

на:

```ts
- Не выдумывай скидки и сертификаты. Паспорта качества на каждую партию у нас есть — упоминай это как преимущество; конкретный комплект документов под партию подтвердит менеджер.
```

- [ ] **Step 3: Проверить типы**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Проверить ответ вручную**

При запущенном `npm run dev`:

```bash
curl -s http://localhost:3000/api/ai-assistant -X POST -H "Content-Type: application/json" -d '{"sessionId":"test-prompt","messages":[{"role":"user","content":"А вы перекупщики или сами производите? Какие документы даете?"}],"pagePath":"/"}'
```

Expected: в `reply` упомянуты собственный карьер/производитель и паспорта качества, без выдуманных сертификатов.

- [ ] **Step 5: Commit**

```bash
git add lib/ai/assistant.ts
git commit -m "feat(ai): quarry-owner positioning and quality passports in system prompt"
```

---

### Task 3: Персистентность лидов — JSONL-файл + Telegram не теряет лид при сбое

Сейчас лид существует только как Telegram-сообщение: упал `sendTelegram` — лид потерян. Пишем каждый захваченный лид в `data/leads/ai-leads.jsonl` до отправки в Telegram; ошибку Telegram логируем, но лид уже на диске. Монтируем `./data` volume в docker-compose, чтобы файл переживал redeploy.

**Files:**
- Create: `lib/ai/lead-store.ts`
- Modify: `app/api/ai-assistant/route.ts:55-73`
- Modify: `docker-compose.yml:2-7`
- Modify: `.gitignore` (добавить `data/leads/`)

**Interfaces:**
- Consumes: `AssistantLeadDraft` из `lib/ai/lead.ts` (существует).
- Produces: `appendAiLead(record: AiLeadRecord): Promise<void>` из `lib/ai/lead-store.ts`, где `AiLeadRecord = { lead: AssistantLeadDraft; pagePath: string; sessionId: string; capturedAt: string }`.

- [ ] **Step 1: Создать lead-store**

Создать `lib/ai/lead-store.ts`:

```ts
import { appendFile, mkdir } from 'fs/promises'
import path from 'path'
import type { AssistantLeadDraft } from './lead'

export interface AiLeadRecord {
  lead: AssistantLeadDraft
  pagePath: string
  sessionId: string
  capturedAt: string
}

const LEADS_DIR = path.join(process.cwd(), 'data', 'leads')
const LEADS_FILE = path.join(LEADS_DIR, 'ai-leads.jsonl')

export async function appendAiLead(record: AiLeadRecord): Promise<void> {
  await mkdir(LEADS_DIR, { recursive: true })
  await appendFile(LEADS_FILE, `${JSON.stringify(record)}\n`, 'utf8')
}
```

- [ ] **Step 2: Встроить в route до Telegram и защитить Telegram try/catch**

В `app/api/ai-assistant/route.ts` добавить импорт:

```ts
import { appendAiLead } from '@/lib/ai/lead-store'
```

и заменить блок:

```ts
    if (phoneJustCaptured) {
      const lead = result.lead
      const lines = [
```

...до `saved = true` включительно, на:

```ts
    if (phoneJustCaptured) {
      const lead = result.lead

      try {
        await appendAiLead({
          lead,
          pagePath,
          sessionId,
          capturedAt: new Date().toISOString(),
        })
        saved = true
      } catch (storeError) {
        console.error('[ai-assistant] Lead file write failed:', storeError, JSON.stringify(lead))
      }

      const lines = [
        '<b>Новый лид из AI-чата</b>',
        lead.name ? `Имя: <b>${escapeHtml(lead.name)}</b>` : '',
        `Телефон: <b>${escapeHtml(lead.phone ?? '')}</b>`,
        lead.city ? `Город: ${escapeHtml(lead.city)}` : '',
        lead.productInterest ? `Товар: ${escapeHtml(lead.productInterest)}` : '',
        lead.quantityTons ? `Объём: ${lead.quantityTons} т` : '',
        lead.packaging ? `Упаковка: ${escapeHtml(lead.packaging)}` : '',
        lead.budget ? `Бюджет/сроки: ${escapeHtml(lead.budget)}` : '',
        lead.need ? `Задача: ${escapeHtml(lead.need)}` : '',
        lead.summary ? `Итог: ${escapeHtml(lead.summary)}` : '',
        pagePath ? `Страница: ${escapeHtml(pagePath)}` : '',
        `Время: ${new Date().toLocaleString('ru-RU')}`,
      ].filter(Boolean)

      try {
        await sendTelegram(lines.join('\n'))
        saved = true
      } catch (telegramError) {
        console.error('[ai-assistant] Telegram send failed, lead persisted to file:', telegramError)
      }
    }
```

- [ ] **Step 3: Volume в docker-compose и .gitignore**

В `docker-compose.yml` в сервис `app` добавить volumes:

```yaml
  app:
    build: .
    restart: unless-stopped
    env_file: .env
    expose:
      - "3000"
    volumes:
      - ./data:/app/data
```

В `.gitignore` добавить строку:

```
data/leads/
```

- [ ] **Step 4: Проверить типы**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Проверить запись файла вручную**

При запущенном `npm run dev`:

```bash
curl -s http://localhost:3000/api/ai-assistant -X POST -H "Content-Type: application/json" -d '{"sessionId":"test-lead","messages":[{"role":"user","content":"Мой телефон: +7 900 111-22-33. Перезвоните мне для расчета и КП."}],"pagePath":"/test"}'
cat data/leads/ai-leads.jsonl
```

Expected: файл существует, последняя строка — JSON с `"phone":"+7 900 111-22-33"`, `"sessionId":"test-lead"`, `"pagePath":"/test"`. (В Telegram владельцу уйдёт одно тестовое уведомление — это ожидаемо.)

- [ ] **Step 6: Commit**

```bash
git add lib/ai/lead-store.ts app/api/ai-assistant/route.ts docker-compose.yml .gitignore
git commit -m "feat(ai): persist leads to JSONL before Telegram, survive send failures"
```

---

### Task 4: Персистентность диалога в localStorage

`sessionId` переживает перезагрузку, а сообщения — нет: клиент вернулся, чат пустой. Храним сообщения в localStorage (ключ `amp-ai-messages`, максимум 30), восстанавливаем при монтировании.

**Files:**
- Modify: `components/ai/ai-assistant-widget.tsx` (useEffect с sessionId ~строка 160; setMessages в `sendMessage`)

**Interfaces:**
- Consumes: тип `ChatMessage` (уже в файле).
- Produces: ничего наружу.

- [ ] **Step 1: Восстановление при монтировании**

В `components/ai/ai-assistant-widget.tsx` внутри существующего первого `useEffect` (тот, что читает `amp-ai-session-id`) добавить после установки sessionId:

```ts
    try {
      const storedMessages = window.localStorage.getItem('amp-ai-messages')
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages) as ChatMessage[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch {
      window.localStorage.removeItem('amp-ai-messages')
    }
```

- [ ] **Step 2: Сохранение при изменении сообщений**

Добавить отдельный useEffect после существующего scroll-эффекта:

```ts
  useEffect(() => {
    if (messages.length <= 1) return
    window.localStorage.setItem('amp-ai-messages', JSON.stringify(messages.slice(-30)))
  }, [messages])
```

(`length <= 1` — не перезаписываем сохранённый диалог одним приветствием до восстановления.)

- [ ] **Step 3: Проверить типы**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Проверить в браузере**

`npm run dev` → открыть http://localhost:3000 → открыть виджет → отправить сообщение, дождаться ответа → перезагрузить страницу (F5) → открыть виджет.
Expected: история диалога на месте (и своё сообщение, и ответ бота).

- [ ] **Step 5: Commit**

```bash
git add components/ai/ai-assistant-widget.tsx
git commit -m "feat(ai): persist chat history in localStorage across reloads"
```

---

### Task 5: Воронка стадий лида в Яндекс.Метрику

`getAssistantLeadStage` (`lib/ai/lead.ts:112`) уже считает стадию first_contact → qualification → lead_capture → handoff, но не используется. Возвращаем стадию из API, виджет шлёт цель при продвижении по воронке.

**Files:**
- Modify: `app/api/ai-assistant/route.ts` (импорт + поле ответа)
- Modify: `components/ai/ai-assistant-widget.tsx` (тип `AssistantResponse`, ref стадии, отправка цели)

**Interfaces:**
- Consumes: `getAssistantLeadStage(lead: AssistantLeadDraft): AssistantLeadStage` из `lib/ai/lead.ts` (существует). Стадии: `'first_contact' | 'qualification' | 'lead_capture' | 'handoff'`.
- Produces: поле `stage: string` в JSON-ответе `/api/ai-assistant`; цели Метрики `ai_stage_qualification`, `ai_stage_lead_capture`, `ai_stage_handoff`.

- [ ] **Step 1: Вернуть stage из API**

В `app/api/ai-assistant/route.ts` добавить импорт:

```ts
import { getAssistantLeadStage } from '@/lib/ai/lead'
```

В `NextResponse.json({...})` добавить поле:

```ts
      stage: getAssistantLeadStage(result.lead),
```

- [ ] **Step 2: Отслеживать продвижение в виджете**

В `components/ai/ai-assistant-widget.tsx`:

В тип `AssistantResponse` добавить:

```ts
  stage?: string
```

После `const messagesEndRef = ...` добавить:

```ts
  const stageRef = useRef<string>('first_contact')
  const STAGE_ORDER = ['first_contact', 'qualification', 'lead_capture', 'handoff']
```

В `sendMessage` после `setMessages((current) => [...])` (успешный ответ) добавить:

```ts
      if (data.stage && STAGE_ORDER.indexOf(data.stage) > STAGE_ORDER.indexOf(stageRef.current)) {
        stageRef.current = data.stage
        if (data.stage !== 'first_contact') {
          ymGoal(`ai_stage_${data.stage}`)
        }
      }
```

- [ ] **Step 3: Проверить типы**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Проверить в браузере**

`npm run dev` → открыть виджет → написать «нужна крошка для штукатурки, 5 тонн» → в DevTools Console/Network убедиться, что после ответа ушла цель `ai_stage_qualification` или `ai_stage_lead_capture` (запрос к mc.yandex.ru или лог ymGoal). Проверить, что цель НЕ дублируется при следующем сообщении той же стадии.

- [ ] **Step 5: Создать цели в Метрике (ручной шаг для владельца)**

Отметить в итоговом сообщении пользователю: в интерфейсе Яндекс.Метрики нужно создать JS-цели `ai_stage_qualification`, `ai_stage_lead_capture`, `ai_stage_handoff` (плюс уже используемые `ai_chat_open`, `ai_message_send`, `ai_phone_form_open`, `ai_lead_submit`, `phone_click`).

- [ ] **Step 6: Commit**

```bash
git add app/api/ai-assistant/route.ts components/ai/ai-assistant-widget.tsx
git commit -m "feat(ai): lead stage funnel goals to Yandex Metrika"
```

---

### Task 6: Компактный футер виджета — сворачивание CTA-блока, короткое приветствие, 4 чипа

Футер (подсказка + CTA + 8 чипов + инпут) съедает ~40% высоты виджета. После первого сообщения пользователя CTA-блок сворачивается в одну строку-ссылку; приветствие короче; чипов четыре конверсионных.

**Files:**
- Modify: `components/ai/ai-assistant-widget.tsx` (STARTER_MESSAGES, приветствие, футер)

**Interfaces:**
- Consumes: state `phoneMode`, `setPhoneMode`, форма `handlePhoneSubmit` из текущего кода (реализованы 2026-07-09).
- Produces: ничего наружу.

- [ ] **Step 1: Сократить чипы до 4**

Заменить `STARTER_MESSAGES` на:

```ts
const STARTER_MESSAGES = [
  'Сколько стоит 20 тонн с доставкой?',
  'Подберите фракцию под мою задачу',
  'Хочу получить КП',
  'Какая упаковка и документы?',
]
```

- [ ] **Step 2: Сократить приветствие**

Заменить начальное сообщение в `useState<ChatMessage[]>`:

```ts
    {
      role: 'assistant',
      content: 'Привет! Я Алекс, AI-менеджер АМП. Подберу фракцию, сориентирую по цене, упаковке и документам.',
      structured: {
        nextStep: 'Напишите задачу, город и объем - сразу предложу вариант и что нужно для КП.',
      },
    },
```

- [ ] **Step 3: Сворачивание CTA-блока после первого сообщения пользователя**

Перед `return` компонента добавить:

```ts
  const hasUserMessages = messages.some((message) => message.role === 'user')
```

Обёртку CTA-блока (`<div className="mb-3 rounded-xl border border-brand-sapphire/20 ...">`) заменить условием: если `phoneMode` — форма телефона как сейчас; иначе если `!hasUserMessages` — текущий развёрнутый блок (подсказка + кнопка); иначе — компактная строка:

```tsx
              {phoneMode ? (
                /* существующая форма телефона без изменений */
              ) : !hasUserMessages ? (
                /* существующий развёрнутый блок без изменений */
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setPhoneMode(true)
                    ymGoal('ai_phone_form_open')
                  }}
                  className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-sapphire/30 bg-brand-sapphire/5 px-3 py-1.5 text-xs font-semibold text-brand-sapphire transition-colors hover:bg-brand-sapphire/10 disabled:opacity-50"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Оставить телефон для КП
                </button>
              )}
```

Внешний `div.mb-3.rounded-xl...` при компактном варианте не нужен — условие ставится так, чтобы компактная кнопка рендерилась вместо всего блока (вынести тернарник на уровень обёртки).

- [ ] **Step 4: Скрыть чипы после первого сообщения**

Обернуть блок чипов:

```tsx
              {!hasUserMessages && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {STARTER_MESSAGES.map((starter) => (
                    /* существующая кнопка-чип без изменений */
                  ))}
                </div>
              )}
```

- [ ] **Step 5: Проверить типы и браузер**

Run: `npx tsc --noEmit` — exit 0.
`npm run dev` → открыть виджет: до первого сообщения — 4 чипа и развёрнутый CTA; после отправки сообщения — чипы скрыты, CTA сжат в одну строку, зона сообщений заметно выше. Клик по компактной строке открывает форму телефона.

- [ ] **Step 6: Commit**

```bash
git add components/ai/ai-assistant-widget.tsx
git commit -m "feat(ai): compact widget footer after first message, 4 conversion chips"
```

---

### Task 7: Структурные блоки — брендовые цвета вместо радуги

Блоки solution/recommendation/internetNote/nextStep — четыре разных цвета (emerald/blue/violet/amber). Приводим к нейтральному фону + брендовый акцент; handoff остаётся тёмно-синим.

**Files:**
- Modify: `components/ai/ai-assistant-widget.tsx:44-107` (функция `StructuredBlocks`)

**Interfaces:**
- Consumes: тип `StructuredBlock` (уже в файле).
- Produces: ничего наружу.

- [ ] **Step 1: Перекрасить блоки**

В `StructuredBlocks` заменить четыре цветных блока на единый стиль (handoff-блок НЕ трогать):

```tsx
      {structured.solution && (
        <div className="flex items-start gap-2 rounded-lg border border-brand-sapphire/25 bg-brand-sapphire/5 px-3 py-2 text-xs">
          <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-sapphire" />
          <div>
            <span className="font-semibold text-brand-deep-navy">Решение: </span>
            <span className="text-foreground/80">{structured.solution}</span>
          </div>
        </div>
      )}
      {structured.recommendation && (
        <div className="flex items-start gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-sapphire" />
          <div>
            <span className="font-semibold text-brand-deep-navy">Рекомендация: </span>
            <span className="text-foreground/80">{structured.recommendation}</span>
          </div>
        </div>
      )}
      {structured.internetNote && (
        <div className="flex items-start gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs">
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-sapphire" />
          <div>
            <span className="font-semibold text-brand-deep-navy">Интернет: </span>
            <span className="text-foreground/80">{structured.internetNote}</span>
          </div>
        </div>
      )}
      {structured.nextStep && (
        <div className="flex items-start gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs">
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-sapphire" />
          <div>
            <span className="font-semibold text-brand-deep-navy">Следующий шаг: </span>
            <span className="text-foreground/80">{structured.nextStep}</span>
          </div>
        </div>
      )}
```

- [ ] **Step 2: Проверить типы и браузер**

Run: `npx tsc --noEmit` — exit 0.
`npm run dev` → открыть виджет, отправить «подберите фракцию для штукатурки» → блоки в ответе: solution выделен брендовым синим, остальные нейтральные, handoff тёмно-синий. Никаких emerald/violet/amber.

- [ ] **Step 3: Commit**

```bash
git add components/ai/ai-assistant-widget.tsx
git commit -m "style(ai): brand-consistent structured blocks instead of rainbow"
```
