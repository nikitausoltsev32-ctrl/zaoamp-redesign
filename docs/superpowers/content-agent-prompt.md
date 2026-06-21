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
