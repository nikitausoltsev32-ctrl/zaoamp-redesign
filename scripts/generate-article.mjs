import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { readTopics, selectNextPending, markStatus, writeTopics } from './lib/topics.mjs'
import { writeArticle } from './lib/article.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SYSTEM_PROMPT = `Ты — B2B-редактор для российского производителя мраморной продукции.
Компания АМП производит мраморную крошку, микрокальцит и мраморный щебень по ТУ 08.12.12-001-45665168-2019.

Подтверждённые технические характеристики (только эти цифры):
- Мраморная крошка 0–3 мм: Аэфф 72 Бк/кг (I класс), твёрдость 3 (Моос), влажность 0,05%, дробимость М200, истираемость И4, морозостойкость F50, насыпная плотность 1,25 т/м³, глинистые/пылевидные 0,12%, зёрна слабых пород 3,69%
- Микрокальцит/мука: CaCO₃ 98%, белизна 98%

Аудитория: снабженцы, технологи, начальники строительных участков.
Платформа: Яндекс Дзен — читают с телефона, лонгрид 1200–1800 слов.

Требования к статье:
- Пиши по-русски, деловой стиль без воды
- Структура: вступление (боль покупателя) → разбор темы с конкретикой → практические советы → вывод
- Используй реальные цифры из паспорта, не придумывай значений
- Заголовки H2/H3 через ## / ###
- Не упоминай бренд в тексте — статья должна быть полезной сама по себе
- Никаких списков «10 причин...» и кликбейта
- В конце абзац «Итого» с чёткими критериями выбора`

async function main() {
  const data = readTopics()
  const topic = selectNextPending(data, 'dzen')
  if (!topic) {
    console.log('Нет pending-тем для dzen в topics.json')
    return
  }

  console.log(`Генерирую: ${topic.title}`)

  const client = new Anthropic()
  const date = new Date().toISOString().slice(0, 10)

  let body = ''

  const stream = client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Напиши статью для Яндекс Дзен на тему: «${topic.title}»\n\nАудитория: ${topic.audience === 'b2b' ? 'B2B-снабженцы и технологи' : 'прорабы и строители'}.\n\nНачинай сразу с текста статьи — без meta-комментариев.`,
      },
    ],
  })

  process.stdout.write('Генерация')
  stream.on('text', (text) => {
    body += text
    process.stdout.write('.')
  })

  await stream.finalMessage()
  console.log(' готово')

  const abs = writeArticle(topic, { date, body })
  console.log(`Записано: ${abs}`)

  markStatus(data, topic.slug, 'generated', { generated_at: date })
  writeTopics(data)
  console.log(`topics.json обновлён: ${topic.slug} → generated`)
}

main().catch((e) => { console.error(e); process.exit(1) })
