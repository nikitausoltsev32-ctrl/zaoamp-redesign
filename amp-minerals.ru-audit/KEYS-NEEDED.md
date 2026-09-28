# Какие ключи нужны и что каждый открывает

Проверено 12.09.2026. Порядок — по важности для текущей задачи.

---

## 1. Яндекс.Вебмастер API — OAuth-токен ⭐ самое важное

**Что открывает:** индексацию в Яндексе (страницы в поиске, исключённые и почему),
реальные запросы с показами и кликами, **региональную привязку сайта**, внешние ссылки
(Яндекс показывает их в панели), ошибки и рекомендации, ИКС.

Это единственный источник, который ответит на «есть ли мы в Яндексе и почему нас нет по
коммерческим запросам». TopVisor показывает только позиции — он не видит, сколько страниц
в индексе и какой регион присвоен сайту.

**Как получить:**
1. `https://oauth.yandex.ru/client/new` → создать приложение, платформа «Веб-сервисы»,
   Redirect URI `https://oauth.yandex.ru/verification_code`.
2. Права: `webmaster:hostinfo`, `webmaster:verify`.
3. Получить `client_id` → открыть
   `https://oauth.yandex.ru/authorize?response_type=token&client_id=<CLIENT_ID>`
   → скопировать токен из адресной строки.

**Что мне передать:** `YANDEX_WEBMASTER_TOKEN` (строка вида `y0_Ag...`).

---

## 2. Яндекс Wordstat — нужен токен Яндекс.Директ API

TopVisor **не подходит**: я проверил модуль частотности в проекте 32272062 —
поля `volume:0:225:1`, `volume:0:225:2`, `volume:0:225:3`, `volume:1:225:1` возвращают
`null` по всем 33 запросам. То есть частотность в проекте **никогда не собиралась**.
Собрать её через TopVisor можно, но это платная операция со баланса аккаунта, и она даёт
только те фразы, что уже в проекте — расширять ядро ей нельзя.

Для сбора ядра с нуля нужен один из двух вариантов:

**Вариант А — Яндекс.Директ API (бесплатно, правильный путь):**
1. Нужен аккаунт Яндекс.Директ (можно без пополнения).
2. `https://direct.yandex.ru/registered/main.pl?cmd=apiSettings` → заявка на доступ к API.
3. OAuth-приложение с правом `direct:api` → токен.
4. Методы: `KeywordsResearch.hasSearchVolume` и Wordstat через
   `https://api.direct.yandex.ru/v4/json/` (`GetKeywordsSuggestion`, `CreateNewWordstatReport`).

**Что передать:** `YANDEX_DIRECT_TOKEN` + логин клиента Директа.

**Вариант Б — TopVisor «Подбор фраз» (платно, быстро):**
Если Директ разворачивать не хочется — скажи, я запущу подбор и сбор частотности в TopVisor
по проекту. **Это списывает деньги с баланса TopVisor**, поэтому без твоего явного «да»
я ничего не запускаю. Сначала скажу примерную стоимость.

---

## 3. Google API key — бесплатный, 1 минута

**Что открывает:** полевые Core Web Vitals из реальных браузеров (CrUX API + CrUX History
— LCP, INP, CLS по факту, а не в лаборатории) и PageSpeed Insights v5.

Важно: **безключевой PSI больше не работает** — проверил, отдаёт
`429 Quota exceeded, quota_limit_value: 0`. Раньше работал, сейчас нет.

**Как получить:** `console.cloud.google.com` → APIs & Services → Credentials →
Create API key. Включить «PageSpeed Insights API» и «Chrome UX Report API».

**Что передать:** `GOOGLE_API_KEY`.

---

## 4. Google Search Console API — OAuth

**Что открывает:** есть ли сайт в индексе Google и почему нет (URL Inspection API),
реальные клики/показы/CTR/позиции по запросам и страницам, покрытие.

Это закроет вопрос по нулевому Google в TopVisor. Сайт уже верифицирован в GSC —
токен `K3sSDP3dYdah1XesYF2441-Z2mhQF1U1oDXY0YjNR9M` стоит в `<head>`, так что доступ есть,
не хватает только программного.

**Как получить:**
1. `console.cloud.google.com` → включить «Google Search Console API».
2. Credentials → Create OAuth client ID → тип **Desktop app** → скачать `client_secret.json`.
3. Отдать мне путь к файлу, я выполню:
   `claude-seo run google_auth.py --auth --creds <путь>` — откроется браузер на один раз.

**Что передать:** путь к `client_secret.json`.

---

## 5. Bing Webmaster Tools API — бесплатный, закрывает ссылки

**Что открывает:** входящие ссылки (referring domains + анкоры), индексацию в Bing,
запросы. Это **самый дешёвый способ получить ссылочный профиль** — Moz free-тариф даёт
2500 строк/мес, но только DA/PA, а Bing отдаёт сами ссылки.

Сайт в индексе Bing точно есть — проверил через DuckDuckGo (работает на индексе Bing),
видны как минимум `/`, `/about/`, `/catalog/`, `/catalog/shcheben/`, `/contacts/`,
`/moskva/`, `/primenenie/`, `/product/mramornaya-kroshka-0-1/`,
`/product/mramornaya-kroshka-0-5-1-0/`, `/product/mramornaya-muka-0-0-2/`.

**Как получить:** `bing.com/webmasters` → добавить/подтвердить сайт (можно импортом из GSC)
→ Settings → API access → сгенерировать ключ.

**Что передать:** `BING_WEBMASTER_API_KEY`.

---

## 6. Moz API — опционально

**Что открывает:** Domain Authority, Page Authority, спам-скор, анкор-лист.
Бесплатно 2500 строк/мес на `moz.com/products/api`.

Нужен для сравнения с конкурентами: без DA непонятно, на сколько сайт отстаёт по
ссылочному от тех, кто стоит в топе.

**Что передать:** `MOZ_API_KEY` (и `MOZ_SECRET_KEY`, если тариф старого типа).

---

## Куда складывать ключи

Просто пришли мне значения — я разложу сам:

| Ключ | Куда пишется |
|---|---|
| `GOOGLE_API_KEY` | `~/.config/claude-seo/google-api.json` → поле `api_key` |
| `client_secret.json` (GSC) | `claude-seo run google_auth.py --auth --creds <путь>` |
| `MOZ_API_KEY` | `~/.config/claude-seo/backlinks-api.json` → `moz_api_key` |
| `BING_WEBMASTER_API_KEY` | `~/.config/claude-seo/backlinks-api.json` → `bing_api_key` |
| `YANDEX_WEBMASTER_TOKEN` | скрипт-обёртка в `scripts/` (готовых в claude-seo нет, напишу) |
| `YANDEX_DIRECT_TOKEN` | то же |

Токены не коммитим: всё вне репозитория, в `~/.config/claude-seo/`.

---

## Что ещё сломано в инструментах (не ключи)

| Инструмент | Состояние | Что делать |
|---|---|---|
| Chrome-расширение Claude | не подключено | нужно, чтобы вручную смотреть выдачу Яндекса и Wordstat. `claude.ai/chrome`, затем перезапустить Chrome |
| Playwright MCP | не поднялся (кэш неудачи) | нужен для скриншотов и лабораторных CWV. Перезапустится сам через 15 мин или правкой конфига плагина |
| GitHub MCP | `400 Authorization header is badly formatted` | к аудиту не относится, но токен битый |
| Internet Archive | `Temporarily Offline` (на стороне archive.org) | нужен для истории домена, повторить позже |

---

## Минимальный набор, если не хочется возиться со всем

Два ключа закрывают 80% пробелов:

1. **`YANDEX_WEBMASTER_TOKEN`** — индексация в Яндексе, региональная привязка, реальные
   запросы, внешние ссылки. Основной поисковик для этой тематики.
2. **`BING_WEBMASTER_API_KEY`** — ссылочный профиль.

Плюс `GOOGLE_API_KEY` (минута работы) для полевых CWV.
