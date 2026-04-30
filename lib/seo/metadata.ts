import type { Metadata } from 'next'
import type { Product } from '@/types'
import type { BlogPost } from '@/lib/data/blog'
import type { CategoryData } from '@/lib/data/categories'

export const SITE_URL = 'https://amp-minerals.ru'
export const SITE_NAME = 'АМП'
export const COMPANY_NAME = 'ЗАО «АМП ИМПОРТ-ЭКСПОРТ»'
export const DEFAULT_REGION = 'Россия'

const DEFAULT_TITLE = 'Белая мраморная крошка и щебень от производителя'
const DEFAULT_DESCRIPTION =
  'Белая мраморная крошка, щебень, мраморная мука и микрокальцит от производителя. Подберём фракцию, упаковку и доставку по России под ваш объект и регион.'

function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU').format(price)
}

function normalizeValue(value?: string) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.toLowerCase() === 'по запросу') {
    return undefined
  }
  return trimmed
}

function joinPackagings(packaging: string[]) {
  return packaging
    .filter(Boolean)
    .slice(0, 3)
    .join(', ')
}

function createMetadata({
  title,
  description,
  path,
  keywords,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: 'website' | 'article'
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function getProductImageAlt(product: Product) {
  const overrides: Record<string, string> = {
    'mramornaya-kroshka-5-10': 'Белая мраморная крошка 5-10 мм в биг-бэге',
    'mramornyj-shheben-10-20': 'Мраморный щебень 10-20 мм',
    'mikrokaltsit-5-200-mkm': 'Микрокальцит белый порошок',
  }

  if (overrides[product.slug]) {
    return overrides[product.slug]
  }

  const primaryPackaging = product.specifications.packaging[0]?.toLowerCase()

  if (product.name.toLowerCase().includes('микрокальцит')) {
    return `${product.name} белый порошок`
  }

  if (primaryPackaging?.includes('биг-бэг')) {
    return `Белая ${product.name.toLowerCase()} в биг-бэге`
  }

  return product.name
}

function buildProductTitle(product: Product) {
  if (typeof product.pricePerTon === 'number') {
    return `${product.name} купить - цена ${formatPrice(product.pricePerTon)} ₽/т`
  }

  return `${product.name} купить - характеристики и доставка`
}

function buildProductDescription(product: Product) {
  const segments = [
    `${product.name} от производителя.`,
    `Фракция ${product.fraction}.`,
  ]

  const whiteness = normalizeValue(product.specifications.whiteness)
  if (whiteness) {
    segments.push(`Белизна ${whiteness}.`)
  }

  const packagings = joinPackagings(product.specifications.packaging)
  if (packagings) {
    segments.push(`Упаковка: ${packagings}.`)
  }

  if (typeof product.pricePerTon === 'number') {
    segments.push(`Цена от ${formatPrice(product.pricePerTon)} ₽/т.`)
  }

  segments.push('Доставка по России.')
  segments.push('Точная цена зависит от объёма, упаковки и способа доставки.')

  return segments.join(' ')
}

function buildCategoryDescription(category: CategoryData, productCount: number, minPrice?: number) {
  const parts = [
    `${category.breadcrumbLabel} от производителя.`,
    `${productCount} ${productCount === 1 ? 'позиция' : productCount < 5 ? 'позиции' : 'позиций'} в каталоге.`,
  ]

  if (typeof minPrice === 'number') {
    parts.push(`Цена от ${formatPrice(minPrice)} ₽/т.`)
  }

  parts.push('Подберём фракцию, упаковку и доставку по России под объект, объём и регион.')

  return parts.join(' ')
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${DEFAULT_TITLE} | ${COMPANY_NAME}`,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: COMPANY_NAME }],
  creator: COMPANY_NAME,
  publisher: COMPANY_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  verification: {
    google: 'K3sSDP3dYdah1XesYF2441-Z2mhQF1U1oDXY0YjNR9M',
    yandex: '322f44e09d1f4187',
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export function generateHomeMetadata(): Metadata {
  return createMetadata({
    title: 'Мраморная крошка и щебень купить в Екатеринбурге',
    description:
      'Белая мраморная крошка, щебень и микрокальцит от производителя. Белизна 98%, фракции 0–200 мм, доставка по России. Расчёт стоимости в день обращения.',
    path: '/',
    keywords: [
      'мраморная крошка купить екатеринбург',
      'белая мраморная крошка 98% белизна',
      'мраморный щебень от производителя',
      'микрокальцит купить',
      'мраморная мука цена',
    ],
  })
}

export function generateCatalogMetadata(productCount: number, minPrice?: number): Metadata {
  const priceText = typeof minPrice === 'number' ? `Цена от ${formatPrice(minPrice)} ₽/т.` : ''

  return createMetadata({
    title: 'Каталог мраморной крошки и щебня — купить в Екатеринбурге',
    description: `Каталог белой мраморной продукции: ${productCount} позиций с характеристиками, упаковкой и доставкой по России. ${priceText} Подберём решение под объект и регион.`,
    path: '/catalog',
    keywords: [
      'каталог мраморной крошки',
      'мраморный щебень купить',
      'микрокальцит от производителя',
      'мраморная мука цена',
      'доставка мраморной продукции',
    ],
  })
}

export function generateCategoryMetadata(category: CategoryData, products: Product[]): Metadata {
  const minPrice = products
    .map((product) => product.pricePerTon)
    .filter((price): price is number => typeof price === 'number')
    .sort((a, b) => a - b)[0]

  const titleMap: Record<CategoryData['slug'], string> = {
    shcheben: 'Мраморный щебень купить в Екатеринбурге — фракции 10–200 мм, цена от производителя',
    kroshka: 'Мраморная крошка купить в Екатеринбурге — фракции, белизна 98%, цена от производителя',
    muka: 'Мраморная мука и микрокальцит купить от производителя',
  }

  return createMetadata({
    title: titleMap[category.slug],
    description: buildCategoryDescription(category, products.length, minPrice),
    path: `/catalog/${category.slug}`,
    keywords: category.seo.keywords,
  })
}

export function generateProductMetadata(product: Product): Metadata {
  return {
    ...createMetadata({
      title: buildProductTitle(product),
      description: buildProductDescription(product),
      path: `/product/${product.slug}`,
      keywords: [
        product.name.toLowerCase(),
        `${product.fraction} купить`,
        'доставка по россии',
        'цена за тонну',
      ],
    }),
    openGraph: {
      type: 'website',
      url: `/product/${product.slug}`,
      title: buildProductTitle(product),
      description: buildProductDescription(product),
      siteName: SITE_NAME,
      locale: 'ru_RU',
      images: product.image
        ? [
            {
              url: absoluteUrl(product.image),
              alt: getProductImageAlt(product),
            },
          ]
        : undefined,
    },
  }
}

export function generateAboutMetadata(): Metadata {
  return createMetadata({
    title: 'О производстве белой мраморной крошки и щебня',
    description:
      'Производство белой мраморной крошки, щебня, мраморной муки и микрокальцита. Собственное сырьё, упаковка, отгрузка и поставки по России.',
    path: '/about',
    keywords: [
      'о производстве мраморной крошки',
      'производитель мраморного щебня',
      'карьер белого мрамора',
      'амп екатеринбург',
    ],
  })
}

export function generateContactsMetadata(): Metadata {
  return createMetadata({
    title: 'Контакты АМП - отдел продаж и отгрузка',
    description:
      'Контакты АМП: телефон, email, Telegram, WhatsApp и адрес офиса в Екатеринбурге. Рассчитаем стоимость под ваш объём, упаковку и регион поставки.',
    path: '/contacts',
    keywords: [
      'контакты амп',
      'купить мраморную крошку екатеринбург',
      'отдел продаж щебень',
      'контакты микрокальцит',
    ],
  })
}

export function generateDeliveryMetadata(): Metadata {
  return createMetadata({
    title: 'Доставка мраморной крошки и щебня по России',
    description:
      'Авто- и ж/д доставка мраморной крошки, щебня, муки и микрокальцита по России. Точная стоимость зависит от объёма, упаковки и способа отгрузки.',
    path: '/delivery',
    keywords: [
      'доставка мраморной крошки',
      'доставка мраморного щебня',
      'жд отгрузка',
      'автодоставка по россии',
    ],
  })
}

export function generateDocumentsMetadata(documentCount: number): Metadata {
  return createMetadata({
    title: 'Паспорта качества на мраморную продукцию',
    description: `Раздел с доступными паспортами качества на мраморную продукцию АМП. Сейчас на сайте опубликовано ${documentCount} подтверждённых документов для отдельных позиций.`,
    path: '/documents',
    keywords: [
      'паспорта качества мраморная крошка',
      'документы на щебень',
      'паспорт качества микрокальцит',
    ],
  })
}

export function generateBlogMetadata(): Metadata {
  return createMetadata({
    title: 'Блог о мраморной крошке, щебне и микрокальците',
    description:
      'Статьи о выборе фракции, применении мраморной крошки, щебня, муки и микрокальцита. Практика для строительных, производственных и ландшафтных задач.',
    path: '/blog',
    keywords: [
      'блог о мраморной крошке',
      'применение мраморного щебня',
      'статьи о микрокальците',
      'как выбрать фракцию',
    ],
  })
}

export function generateBlogPostMetadata(post: BlogPost): Metadata {
  return {
    ...createMetadata({
      title: post.seo.title,
      description: post.seo.description,
      path: `/blog/${post.slug}`,
      keywords: post.seo.keywords,
      type: 'article',
    }),
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: post.seo.title,
      description: post.seo.description,
      siteName: SITE_NAME,
      locale: 'ru_RU',
      publishedTime: post.publishDate,
    },
  }
}
