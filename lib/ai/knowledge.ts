import { categories } from '@/lib/data/categories'
import { contactInfo } from '@/lib/data/contacts'
import { qualityDocuments } from '@/lib/data/documents'
import { products } from '@/lib/data/products'
import {
  applicationLandingPages,
  cityLandingPages,
} from '@/lib/data/seo-landings'
import type { Product } from '@/types'
import {
  withManagerHandoffConfirmation,
  type AssistantLeadDraft,
  type AssistantLeadMessage,
} from './lead'

const CATEGORY_LABELS: Record<Product['category'], string> = {
  scherb: 'мраморный щебень',
  kroshka: 'мраморная крошка',
  muika: 'мраморная мука и микрокальцит',
  otsev: 'отсев',
}

const USE_CASE_RULES = [
  {
    pattern: /(ландшафт|клумб|дорожк|отсыпк|рокари|сад|декор|мульч)/i,
    slugs: [
      'mramornaya-kroshka-5-10',
      'mramornaya-kroshka-2-3',
      'mramornaya-kroshka-1-5-2-0',
      'mramornaya-kroshka-0-5-1-0',
    ],
    note: 'для ландшафта чаще выбирают крошку 2-3 мм или 5-10 мм, для более ровного декоративного слоя - 0.5-2 мм',
  },
  {
    pattern: /(штукатур|смес|шпаклев|фасад|затир|сухих|сухие)/i,
    slugs: [
      'mramornaya-kroshka-0-5',
      'mramornaya-kroshka-0-1',
      'mramornaya-kroshka-0-5-1-0',
      'mramornaya-muka-0-0-2',
    ],
    note: 'для штукатурок и сухих смесей важна мелкая стабильная фракция: 0-1, 0.5-1.0, 0-5 мм или мука',
  },
  {
    pattern: /(бетон|жби|плитк|фундамент|дорог|основан|строител)/i,
    slugs: [
      'mramornyj-shheben-10-20',
      'mramornyj-shheben-20-50',
      'mramornyj-shheben-50-200',
    ],
    note: 'для бетона и ЖБИ обычно смотрят 10-20 мм, для оснований и отсыпки - 20-50 мм',
  },
  {
    pattern: /(дренаж|транше|фильтр|водоотвод)/i,
    slugs: ['mramornyj-shheben-20-50', 'mramornyj-shheben-50-200'],
    note: 'для дренажа лучше крупные фракции 20-50 мм или 50-200 мм, мелкая крошка быстрее забивается',
  },
  {
    pattern: /(лкм|краск|лак|пластик|полимер|пвх|резин|хими)/i,
    slugs: ['mikrokaltsit-5-200-mkm', 'mramornaya-muka-0-0-2'],
    note: 'для ЛКМ, пластика и полимеров нужны микрокальцит или мраморная мука с контролем белизны и CaCO3',
  },
  {
    pattern: /(сельхоз|почв|известк|раскисл|корм|птиц|животн)/i,
    slugs: ['mramornaya-muka-0-0-2'],
    note: 'для сельского хозяйства и известкования обычно рассматривают мраморную муку 0-0.2 мм',
  },
]

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,;:!?()[\]{}"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatPrice(product: Product) {
  if (!product.pricePerTon) return 'цена по запросу'
  return `${new Intl.NumberFormat('ru-RU').format(product.pricePerTon)} ₽/т без доставки`
}

function productSearchText(product: Product) {
  return normalizeText([
    product.name,
    product.slug,
    CATEGORY_LABELS[product.category],
    product.fraction,
    product.description,
    product.applications.join(' '),
    product.specifications.packaging.join(' '),
    product.specifications.whiteness,
    product.specifications.caco3 ?? '',
    product.seo.keywords.join(' '),
  ].join(' '))
}

function scoreProduct(product: Product, query: string) {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) return 0

  const productText = productSearchText(product)
  const queryTerms = normalizedQuery
    .split(' ')
    .filter((term) => term.length > 2)

  let score = 0
  for (const term of queryTerms) {
    if (productText.includes(term)) score += 1
  }

  const fraction = normalizeText(product.fraction.replace('.', ','))
  const alternateFraction = normalizeText(product.fraction.replace(',', '.'))
  if (normalizedQuery.includes(fraction) || normalizedQuery.includes(alternateFraction)) {
    score += 8
  }

  for (const rule of USE_CASE_RULES) {
    if (!rule.pattern.test(normalizedQuery)) continue
    if (rule.slugs.includes(product.slug)) score += 12
  }

  return score
}

function lastUserMessage(messages: AssistantLeadMessage[]) {
  return [...messages].reverse().find((message) => message.role === 'user')?.content ?? ''
}

function relevantUseCaseNotes(query: string) {
  const normalizedQuery = normalizeText(query)
  return USE_CASE_RULES
    .filter((rule) => rule.pattern.test(normalizedQuery))
    .map((rule) => rule.note)
}

export function findRelevantProducts(query: string, maxResults = 4) {
  return products
    .map((product) => ({ product, score: scoreProduct(product, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.product)
}

export function buildAssistantKnowledgeContext() {
  const catalog = products.map((product) => ({
    name: product.name,
    slug: product.slug,
    category: CATEGORY_LABELS[product.category],
    fraction: product.fraction,
    price: formatPrice(product),
    description: product.description,
    applications: product.applications,
    packaging: product.specifications.packaging,
    whiteness: product.specifications.whiteness,
    caco3: product.specifications.caco3 ?? 'по запросу',
    radioactivity: product.specifications.radioactivity ?? 'по запросу',
    documents: qualityDocuments
      .filter((document) => document.productSlug === product.slug)
      .map((document) => ({ name: document.name, href: document.href })),
    url: `/product/${product.slug}/`,
  }))

  const categoryKnowledge = Object.values(categories).map((category) => ({
    name: category.h1,
    url: `/catalog/${category.slug}/`,
    intro: category.intro,
    keyPoints: category.keyPoints,
    applications: category.applications,
    faqs: category.faqs,
  }))

  const applications = Object.values(applicationLandingPages).map((page) => ({
    name: page.label,
    url: `/primenenie/${page.slug}/`,
    intro: page.intro,
    recommendedProducts: page.productSlugs,
    recommendations: page.recommendations,
    proofPoints: page.proofPoints,
    faqs: page.faqs,
  }))

  const cities = Object.values(cityLandingPages).map((page) => ({
    city: page.city,
    url: `/${page.slug}/`,
    intro: page.intro,
    delivery: page.deliveryText,
    logistics: page.logistics,
    targetProducts: page.targetProducts,
    faqs: page.faqs,
  }))

  return JSON.stringify({
    company: {
      name: 'ЗАО АМП',
      profile: 'производитель белой мраморной крошки, мраморного щебня, мраморной муки и микрокальцита',
      strengths: [
        'собственный карьер и производство',
        'белизна продукции до 98%',
        'CaCO3 до 98-99% по позициям',
        'радиационный класс 1 по указанным продуктам',
        'отгрузка навалом, в биг-бэгах 500 кг/1 т и мешках по доступности позиции',
        'авто и ж/д доставка по России',
      ],
      contacts: contactInfo,
    },
    rules: [
      'точные остатки, финальные сроки и итоговую цену с доставкой подтверждает менеджер',
      'если цена есть в каталоге, называй ее только как ориентир без доставки',
      'если документа нет в списке, говори что менеджер подтвердит актуальный паспорт под партию',
      'для расчета КП нужны город, объем в тоннах, фракция или задача, упаковка и телефон',
    ],
    catalog,
    categoryKnowledge,
    applications,
    cities,
    documents: qualityDocuments,
  }, null, 2)
}

export function buildRuleBasedAssistantReply(
  messages: AssistantLeadMessage[],
  lead: AssistantLeadDraft
) {
  const userText = lastUserMessage(messages)
  const matchedProducts = findRelevantProducts(userText, 3)
  const notes = relevantUseCaseNotes(userText)
  const wantsPrice = /(цен|стоим|сколько|прайс|руб|₽|кп|рассчит)/i.test(userText)
  const wantsDocs = /(документ|паспорт|сертификат|качества|радиац)/i.test(userText)
  const wantsDelivery = /(достав|город|логист|транспорт|ж\/д|жд|самовывоз)/i.test(userText)

  if (matchedProducts.length > 0) {
    const primary = matchedProducts[0]
    const alternatives = matchedProducts
      .slice(1)
      .map((product) => `${product.name} (${formatPrice(product)})`)
      .join('; ')
    const priceText = wantsPrice
      ? `По цене: ${formatPrice(primary)}. Итог с доставкой менеджер считает по городу, объему и упаковке.`
      : `Ориентир по каталогу: ${formatPrice(primary)}.`
    const docsText = wantsDocs
      ? `По документам: радиационный класс и паспорт качества нужно подтвердить под конкретную партию; доступные паспорта есть по части фракций.`
      : ''
    const deliveryText = wantsDelivery
      ? `По доставке: возим авто и ж/д по России, точный тариф зависит от города, веса, упаковки и даты отгрузки.`
      : ''
    const nextStep = lead.phone
      ? 'Я передам менеджеру задачу, продукт, объем и телефон; он уточнит наличие, доставку и финальную цену.'
      : 'Напишите город доставки, объем в тоннах и телефон - менеджер посчитает точное КП с логистикой.'

    const reply = [
      `По вашей задаче первым смотрел бы ${primary.name}: ${primary.description}`,
      notes[0] ? `Почему: ${notes[0]}.` : '',
      priceText,
      alternatives ? `Еще можно сравнить: ${alternatives}.` : '',
      docsText,
      deliveryText,
      nextStep,
    ].filter(Boolean).join(' ')

    return {
      reply: withManagerHandoffConfirmation(reply, lead),
      structured: {
        solution: primary.name,
        recommendation: notes[0] ?? `${primary.name}: ${primary.applications.slice(0, 3).join(', ')}.`,
        nextStep,
        handoff: lead.phone ? 'Контакт есть - передаем менеджеру для расчета и подтверждения условий.' : null,
      },
    }
  }

  const reply = [
    'Я могу подобрать фракцию и собрать заявку, но по текущему сообщению не понял задачу до конца.',
    'Напишите, где будете применять материал: ландшафт, дорожки, дренаж, бетон, штукатурка, ЛКМ, пластик или сельхоз.',
    'Для точного КП нужны город доставки, объем в тоннах, желаемая упаковка и телефон.',
  ].join(' ')

  return {
    reply: withManagerHandoffConfirmation(reply, lead),
    structured: {
      solution: null,
      recommendation: 'Основные направления: крошка для ландшафта и штукатурок, щебень для отсыпки/бетона/дренажа, мука и микрокальцит для производства.',
      nextStep: 'Уточните задачу, город и объем - подберу конкретную фракцию из каталога.',
      handoff: lead.phone ? 'Контакт есть - менеджер сможет уточнить задачу и рассчитать КП.' : null,
    },
  }
}
