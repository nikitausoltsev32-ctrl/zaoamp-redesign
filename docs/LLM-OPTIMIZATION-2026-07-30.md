# Подготовка сайта для AI-поиска и снижение нагрузки

Дата: 30 июля 2026

## Что подтверждено

- Опубликованный сайт и локальная production-сборка отдают основной контент в HTML без обязательного выполнения JavaScript.
- `robots.txt`, `llms.txt`, `sitemap.xml`, главная, страницы товаров, городов и применений отвечают HTTP 200.
- OpenAI указывает, что для попадания контента в сводки и фрагменты ChatGPT Search нельзя блокировать `OAI-SearchBot`.
- `llms.txt` — не официальный стандарт OpenAI или Google, а открытое предложение. Он используется как дополнительный краткий Markdown-индекс и не заменяет HTML, robots.txt или sitemap.

## Что изменено

- В `robots.txt` явно разрешены `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Googlebot` и `bingbot`; служебный `/api/` закрыт от обхода.
- `llms.txt` приведён к формату предложения: H1, краткое описание, секции и 29 абсолютных ссылок с пояснениями.
- В `llms.txt` явно зафиксировано, что фото объектов, офиса и интерьеров пока не предоставлены и не могут быть источником визуальных выводов.
- Удалённые фото больше не запрашиваются страницами. Вместо них выводятся именованные слоты с подписями.
- Непрерывный hero-слайдер заменён статичным LCP-изображением.
- Удалены восемь бесконечных анимаций и обработчики движения мыши в карточках преимуществ.
- Убран scroll-обработчик и дорогостоящий `backdrop-blur` у фиксированной шапки.
- Девять используемых товарных исходников общим объёмом 55 995 443 байта заменены на WebP-копии общим объёмом 932 466 байт: снижение 98,3%. Оригиналы сохранены.
- First Load JS главной снизился с 209 kB до 169 kB: минус 40 kB, или около 19%.

## Проверка

- `npm run type-check` — успешно.
- `npm run lint` — успешно.
- `npm run test` — 7/7 тестов успешно.
- `npm run build` — успешно, 51 статическая страница сформирована.
- Главная, `robots.txt`, `llms.txt`, sitemap и выборочные внутренние страницы — HTTP 200.
- В собранном HTML нет ссылок на три удалённых изображения.

## Официальные и первичные источники

- OpenAI, Publishers and Developers FAQ: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- Google Search Central, JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google web.dev, Core Web Vitals: https://web.dev/articles/vitals
- Next.js 14, robots metadata file: https://nextjs.org/docs/14/app/api-reference/file-conventions/metadata/robots
- Next.js 14, Server and Client Component composition: https://nextjs.org/docs/14/app/building-your-application/rendering/composition-patterns
- llms.txt proposal by Jeremy Howard: https://llmstxt.org/

## Ограничение

Эти изменения улучшают доступность, скорость и точность извлечения фактов, но не гарантируют цитирование или позицию в ChatGPT, Google, Perplexity и других системах. Итог зависит также от индексации, авторитетности домена, внешних упоминаний и качества конкретного ответа системы.
