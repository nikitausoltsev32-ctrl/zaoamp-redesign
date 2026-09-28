# Метрика, PageSpeed, семантика, страницы применения — план

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (выбран пользователем: «пиши план и делай» — нативно в этой сессии). Шаги — чекбоксы.

**Goal:** Метрика считает всех посетителей; мобильный PSI ключевых страниц ≥ 90 / LCP < 2,5 с; Wordstat разнесён в ядро; три страницы применения и `/catalog/kroshka/` получают бриф и текст на согласование.

**Architecture:** Точечные правки существующих компонентов Next 14.1 App Router, без смены дизайна. Замеры — Lighthouse локально (`next start`) до/после + PSI на проде после деплоя. Семантика — скрипт слияния CSV в scratchpad, результат в `Seo/semantic/`.

**Tech Stack:** Next 14.1, React 18, Tailwind, framer-motion (LazyMotion), Node 20, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-27-seo-metrika-psi-content-design.md`

## Global Constraints

- Ветка `feat/seo-metrika-speed` от `332a595` (прод). Коммит/деплой — только по команде пользователя.
- Внешний вид не меняется, кроме контраста серого текста и отсутствия fade-in у первого экрана.
- Не выдумывать факты: цифры — только из паспортов/сайта.
- Переобход, удаление целей Метрики, платные вызовы — только после «да».
- Каждый шаг — запись в `Seo/JOURNAL.md`.

## Review Focus

1. Вернувшийся посетитель с `cookie_consent = rejected` в localStorage — Метрика всё равно грузится, баннер не показывается повторно.
2. Посетитель без localStorage (приватный режим, исключение) — Метрика грузится, баннер показывается, клик «Понятно» не роняет страницу.
3. Первый экран главной без JS — H1 и форма видимы (нет `opacity:0` в SSR-HTML).
4. `browserslist` не ломает сборку и не отключает нужные полифилы для Яндекс.Браузера последних версий.
5. Ленивая загрузка AI-виджета — кнопка виджета появляется и открывает чат как раньше; `ymGoal` вызовы работают.

---

### Task 1: Метрика для всех, информационный баннер

**Files:**
- Modify: `components/cookie-consent.tsx`
- Modify: `app/privacy/page.tsx:49,63,69-71`
- Modify: `app/layout.tsx` (`<head>`: preconnect)

- [ ] **Step 1:** Базовый замер — `pnpm build && pnpm start`, в HTML `/` нет `mc.yandex.ru` (подтверждает проблему).
- [ ] **Step 2:** `cookie-consent.tsx` — `<Script id="yandex-metrika" …>` рендерить всегда; тип `Consent = 'accepted' | 'rejected' | null` оставить для совместимости чтения; баннер показывать при `ready && consent === null`; одна кнопка «Понятно» → `choose('accepted')`. Текст: «Сайт использует cookie и Яндекс.Метрику для анализа посещаемости. Подробнее — в политике конфиденциальности.»
- [ ] **Step 3:** `privacy/page.tsx` — строка 49: убрать «(при вашем согласии на cookie)»; строка 63: убрать «либо нажимая «Принять»…»; раздел 5: «Сайт использует файлы cookie и сервис Яндекс.Метрика (ООО «ЯНДЕКС») для анализа посещаемости; при первом посещении показывается уведомление.» + «Вы можете запретить cookie в настройках браузера или заблокировать счётчик расширением-блокировщиком; удалить cookie можно в настройках браузера.»
- [ ] **Step 4:** `layout.tsx` `<head>`: `<link rel="preconnect" href="https://mc.yandex.ru" />`.
- [ ] **Step 5:** `pnpm type-check && pnpm lint && pnpm build && pnpm start`; Playwright: чистый профиль → `typeof window.ym === 'function'`, скрипт `tag.js?id=108746641` есть без клика; баннер виден, «Понятно» скрывает, после reload не показывается; с `localStorage.cookie_consent={"value":"rejected","ts":now}` → `ym` определён, баннера нет (Review Focus 1–2).
- [ ] **Step 6:** Журнал.

### Task 2: LCP — убрать скрытие первого экрана

**Files:**
- Modify: `components/sections/hero.tsx:57-61`
- Modify: `components/sections/category-page-template.tsx` (первый экран), `components/sections/product/product-hero.tsx` и `application-landing-page.tsx` — только если в них `initial={{ opacity: 0 …}}` на элементе первого экрана.

- [ ] **Step 1:** Базовый Lighthouse mobile локально (`npx -y lighthouse http://localhost:3000<path> --form-factor=mobile --only-categories=performance,accessibility --output=json`) для 5 страниц → `Seo/data/2026-09-27/lh-before/`; записать LCP-элемент (`largest-contentful-paint-element`).
- [ ] **Step 2:** В `hero.tsx` левой колонке `initial={{ opacity: 0, y: 30 }}` → `initial={false}` (элемент сразу в финальном состоянии). То же для LCP-элементов, найденных в Step 1, остальные анимации ниже первого экрана не трогать.
- [ ] **Step 3:** Проверка Review Focus 3: `curl -s localhost:3000/ | grep -o 'style="opacity:0[^"]*"' | head` — у блока с H1 нет.
- [ ] **Step 4:** Lighthouse после → `lh-after/`, сравнить LCP.

### Task 3: Тяжёлый JS первого экрана

**Files:**
- Modify: `app/layout.tsx` (импорт AI-виджета)
- Modify: `package.json` (`browserslist`)

- [ ] **Step 1:** `app/layout.tsx`: `AiAssistantWidget` через клиентскую обёртку `components/ai/ai-assistant-widget-lazy.tsx`:
```tsx
'use client'
import dynamic from 'next/dynamic'
export const AiAssistantWidgetLazy = dynamic(
  () => import('./ai-assistant-widget').then((m) => m.AiAssistantWidget),
  { ssr: false },
)
```
  (полный `motion` из framer-motion уходит из общего чанка).
- [ ] **Step 2:** `package.json`: `"browserslist": ["chrome >= 100", "edge >= 100", "firefox >= 100", "safari >= 15", "ios_saf >= 15", "yandex >= 22"]` — при ошибке неизвестного браузера `yandex` убрать его (Яндекс.Браузер на Chromium покрыт `chrome >= 100`).
- [ ] **Step 3:** `pnpm build` — сравнить `First Load JS shared` до/после; Review Focus 5: виджет открывается, отправка не ломается.

### Task 4: CSS, шрифты, контраст, target-size

**Files:**
- Modify: `app/globals.css:18`, `components/calculator.tsx:90-98`, `next.config.js`, `app/layout.tsx` (шрифты)

- [ ] **Step 1:** Контраст: `--muted-foreground: 20 6% 45%` → подобрать минимальную светлоту, дающую ≥ 4.5:1 на `bg-brand-ice-blue` и белом (ожидаемо ~38–40%). Проверить Lighthouse `color-contrast` = 1; проверить кнопку Telegram и хлебные крошки.
- [ ] **Step 2:** Калькулятор `#volume`: `className="h-11"` (≥ 44px) — проверить `target-size`.
- [ ] **Step 3:** Шрифты: Merriweather используется в H1 первого экрана — оставить; убрать preload только если Lighthouse покажет шрифт в критической цепочке без пользы; `display: 'swap'` уже есть.
- [ ] **Step 4:** Render-blocking CSS: попробовать `experimental: { optimizeCss: true }` (+ `pnpm add -D critters`). Lighthouse до/после. Нет эффекта или ошибка → откатить и записать в журнал причину.
- [ ] **Step 5:** Полный прогон: `type-check`, `lint`, `build`, Lighthouse 5 страниц mobile, скриншоты mobile/desktop до/после (`webapp-testing`) — визуальных изменений кроме контраста нет.
- [ ] **Step 6:** Журнал + отчёт пользователю с таблицей до/после; запрос на коммит и деплой.

### Task 5: Семантика — разнести Wordstat

**Files:**
- Modify: `Seo/semantic/core.csv`, `clusters.csv`, `url-map.csv`

- [ ] **Step 1:** Скрипт в scratchpad: join `frequency-results.csv` → `frequency-candidates.csv` + `landscape-candidates.csv` по `query`, + показы/позиции из `data/2026-09-27/gsc-queries.json` и `yandex-queries.json`.
- [ ] **Step 2:** Для `/catalog/kroshka/`, `/primenenie/landshaft/`, `/primenenie/lkm/`, `/primenenie/shtukaturka/`, `/product/mramornaya-kroshka-5-10/`: топ запросов по exact-частоте с целевым интентом → main + supporting в `clusters.csv`; частоты в `core.csv`; `url-map.csv`.
- [ ] **Step 3:** Журнал; итог пользователю (таблица кластер → главный запрос → частота).

### Task 6: Бриф и тексты страниц применения + `/catalog/kroshka/`

**Files:**
- Read: `lib/data/seo-landings.ts`, `components/sections/application-landing-page.tsx`, данные категории крошки, `memory/product_specs.md`

- [ ] **Step 1:** Бриф на 4 страницы: интент, подзапросы из Task 5, чего не хватает сейчас (объём, FAQ, фракции, таблицы).
- [ ] **Step 2:** Черновики только из фактов сайта/паспортов → `humanizer` → показать пользователю. **Стоп до согласования.**
- [ ] **Step 3:** После «да» — внедрить, `type-check/lint/build`, журнал, запрос на деплой и переобход.

---

Порядок: 1 → 2 → 3 → 4 → (коммит/деплой по команде) → 5 → 6.
