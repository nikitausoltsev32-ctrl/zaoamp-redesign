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
const DEFAULT_OG_IMAGE = '/images/products/kroshka-5-10.jpg'
const DEFAULT_OG_IMAGE_ALT = 'Белая мраморная крошка и щебень от производителя АМП'

function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}

export function absoluteSiteUrl(path = '/') {
  return absoluteUrl(path)
}

function withTrailingSlash(path: string) {
  if (path === '/' || path.endsWith('/')) return path
  if (path.startsWith('http')) {
    const url = new URL(path)
    if (!url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`
    }
    return url.toString()
  }

  return `${path}/`
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
  type = 'website',
  brandSuffix = false,
  image,
}: {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  brandSuffix?: boolean
  image?: { url: string; alt?: string }
}): Metadata {
  const normalizedPath = withTrailingSlash(path)
  const ogImageUrl = absoluteUrl(image?.url ?? DEFAULT_OG_IMAGE)
  const ogImageAlt = image?.alt ?? DEFAULT_OG_IMAGE_ALT

  return {
    title: brandSuffix ? title : { absolute: title },
    description,
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      type,
      url: normalizedPath,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'ru_RU',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: ogImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
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
    product.fraction ? `Фракция ${product.fraction}.` : '',
  ].filter(Boolean)

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

  parts.push(
    category.slug === 'landshaftnyj-kamen'
      ? 'Яшма, змеевик, фельзит, златолит, доломит, сланец, речная галька. Опт от 5 тонн, доставка по России.'
      : 'Опт от 5 тонн. Подберём фракцию, упаковку и доставку по России под объект, объём и регион.'
  )

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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export function generateHomeMetadata(): Metadata {
  const base = createMetadata({
    title: 'Мраморная крошка и щебень от производителя — свой карьер',
    description:
      'Белая мраморная крошка, щебень и микрокальцит с собственного карьера. Белизна 98%, фракции 0–200 мм, доставка по России. Расчёт стоимости в день обращения.',
    path: '/',
  })

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [
        {
          url: absoluteUrl('/images/products/kroshka-5-10.jpg'),
          width: 1200,
          height: 630,
          alt: 'Белая мраморная крошка 5-10 мм от производителя АМП',
        },
      ],
    },
    twitter: {
      ...base.twitter,
      images: [absoluteUrl('/images/products/kroshka-5-10.jpg')],
    },
  }
}

export function generateCatalogMetadata(productCount: number, minPrice?: number): Metadata {
  const priceText = typeof minPrice === 'number' ? `Цена от ${formatPrice(minPrice)} ₽/т.` : ''

  return createMetadata({
    title: 'Каталог мраморной крошки, щебня и ландшафтного камня от производителя',
    description: `Каталог с собственного карьера: белая мраморная крошка, щебень, мука, микрокальцит и цветной ландшафтный камень — ${productCount} позиций с характеристиками, упаковкой и доставкой по России. ${priceText}`.trim(),
    path: '/catalog',
  })
}

export function generateCategoryMetadata(category: CategoryData, products: Product[]): Metadata {
  const minPrice = products
    .map((product) => product.pricePerTon)
    .filter((price): price is number => typeof price === 'number')
    .sort((a, b) => a - b)[0]

  const titleMap: Record<CategoryData['slug'], string> = {
    shcheben: 'Белый мраморный щебень от производителя — фракции 10–200 мм, цена',
    kroshka: 'Мраморная крошка оптом от производителя: 8 фракций, мешки, биг-бэги',
    muka: 'Мраморная мука и микрокальцит от производителя с карьера',
    'landshaftnyj-kamen': 'Декоративный щебень и камни для ландшафтного дизайна от производителя',
  }

  return createMetadata({
    title: titleMap[category.slug],
    description: buildCategoryDescription(category, products.length, minPrice),
    path: `/catalog/${category.slug}`,
    image: { url: category.heroImage, alt: category.heroImageAlt },
  })
}

export function generateProductMetadata(product: Product): Metadata {
  const path = `/product/${product.slug}/`
  const title = product.metaTitle ?? buildProductTitle(product)
  const description = product.metaDescription ?? buildProductDescription(product)

  const base = createMetadata({
    title,
    description,
    path,
    image: { url: product.image ?? DEFAULT_OG_IMAGE, alt: getProductImageAlt(product) },
  })

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      url: path,
    },
    other: {
      'og:type': 'product',
    },
  }
}

export function generateAboutMetadata(): Metadata {
  return createMetadata({
    title: 'О производстве белой мраморной крошки и щебня',
    description:
      'Производство белой мраморной крошки, щебня, мраморной муки и микрокальцита. Собственное сырьё, упаковка, отгрузка и поставки по России.',
    path: '/about',
    brandSuffix: true,
  })
}

export function generateContactsMetadata(): Metadata {
  return createMetadata({
    title: 'Контакты АМП - отдел продаж и отгрузка',
    description:
      'Контакты АМП: телефон, email, Telegram, WhatsApp и адрес офиса в Екатеринбурге. Рассчитаем стоимость под ваш объём, упаковку и регион поставки.',
    path: '/contacts',
    brandSuffix: true,
  })
}

export function generateDeliveryMetadata(): Metadata {
  return createMetadata({
    title: 'Доставка мраморной крошки и щебня по России',
    description:
      'Авто- и ж/д доставка мраморной крошки, щебня, муки и микрокальцита по России. Точная стоимость зависит от объёма, упаковки и способа отгрузки.',
    path: '/delivery',
  })
}

export function generateDocumentsMetadata(documentCount: number): Metadata {
  return createMetadata({
    title: 'Паспорта качества на мраморную продукцию',
    description: `Раздел с доступными паспортами качества на мраморную продукцию АМП. Сейчас на сайте опубликовано ${documentCount} подтверждённых документов для отдельных позиций.`,
    path: '/documents',
  })
}

export function generateApplicationsMetadata(): Metadata {
  return createMetadata({
    title: 'Применение мраморной крошки, щебня, муки и микрокальцита',
    description:
      'Посадочные страницы по применению мраморной продукции: ландшафт, дорожная отсыпка, штукатурки, ЛКМ, пластики и сельское хозяйство.',
    path: '/primenenie',
  })
}

export function generateBlogMetadata(): Metadata {
  return createMetadata({
    title: 'Блог о мраморной крошке, щебне и микрокальците',
    description:
      'Статьи о выборе фракции, применении мраморной крошки, щебня, муки и микрокальцита. Практика для строительных, производственных и ландшафтных задач.',
    path: '/blog',
  })
}

export function generateBlogPostMetadata(post: BlogPost): Metadata {
  const base = createMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: `/blog/${post.slug}`,
    type: 'article',
  })

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: post.publishDate,
    },
  }
}
