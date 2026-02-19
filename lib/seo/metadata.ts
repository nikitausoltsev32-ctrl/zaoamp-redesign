import { Metadata } from 'next'
import { Product } from '@/types'

const BASE_URL = 'https://zaoamp.ru'

// Default metadata для всего сайта
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Мраморная крошка и щебень | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    template: '%s | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
  },
  description: 'Производитель белой мраморной крошки и щебня премиум-качества. Доставка по всей России. Белизна до 98%. Цены от 2 900 ₽/тонна.',
  keywords: ['мраморная крошка', 'мраморный щебень', 'белый щебень', 'купить щебень', 'Екатеринбург', 'доставка щебня'],
  authors: [{ name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ' }],
  creator: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
  publisher: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: BASE_URL,
    siteName: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    title: 'Мраморная крошка и щебень | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    description: 'Производитель белой мраморной крошки и щебня премиум-качества. Доставка по всей России.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Мраморная крошка и щебень от ЗАО АМП',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Мраморная крошка и щебень | ЗАО АМП',
    description: 'Производитель белой мраморной крошки и щебня. Доставка по России.',
    images: ['/images/og-image.jpg'],
    creator: '@zaoamp',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

// Metadata для главной страницы
export function generateHomeMetadata(): Metadata {
  return {
    title: 'Мраморная крошка и щебень купить | Производитель | Доставка по России',
    description: 'Купить мраморную крошку и щебень от производителя ЗАО АМП. Белизна 98%, доставка по всей России. Фракции 0-200 мм. Цены от 2 900 ₽/тонна.',
    keywords: [
      'мраморная крошка купить',
      'мраморный щебень',
      'белый щебень',
      'купить щебень екатеринбург',
      'мраморная крошка цена',
      'доставка щебня',
      'производитель мраморной крошки',
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'Мраморная крошка и щебень | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
      description: 'Производитель белой мраморной крошки и щебня. Доставка по России.',
      url: '/',
    },
  }
}

// Metadata для страницы каталога
export function generateCatalogMetadata(): Metadata {
  return {
    title: 'Каталог мраморной крошки и щебня | Цены от производителя',
    description: 'Каталог мраморной крошки и щебня от ЗАО АМП. Все фракции: 0-0.2, 0-5, 5-10, 10-20, 20-50, 50-200 мм. Цены от 2 900 ₽/тонна. Доставка по России.',
    keywords: [
      'мраморный щебень екатеринбург',
      'белый щебень цена',
      'каталог мраморной крошки',
      'купить щебень фракции',
      'мраморная крошка оптом',
    ],
    alternates: {
      canonical: '/catalog',
    },
    openGraph: {
      title: 'Каталог мраморной крошки и щебня | ЗАО АМП',
      description: 'Все фракции мраморной крошки и щебня. Цены от производителя.',
      url: '/catalog',
    },
  }
}

// Metadata для страницы продукта (динамическая)
export function generateProductMetadata(product: Product): Metadata {
  return {
    title: product.seo?.title || `${product.name} купить | Цена ${product.pricePerTon.toLocaleString('ru-RU')} ₽/т`,
    description: product.seo?.description || `${product.description} Доставка по России. Звоните +7 (919) 393-19-92`,
    keywords: product.seo?.keywords || [
      product.name.toLowerCase(),
      'мраморная крошка',
      'мраморный щебень',
      'купить щебень',
      'екатеринбург',
    ],
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: product.seo?.title || `${product.name} | ЗАО АМП`,
      description: product.seo?.description || product.description,
      url: `/product/${product.slug}`,
      images: product.image ? [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ] : undefined,
    },
  }
}

// Metadata для страницы "О компании"
export function generateAboutMetadata(): Metadata {
  return {
    title: 'О компании | Производитель мраморной крошки | ЗАО АМП',
    description: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ — производитель белой мраморной крошки и щебня премиум-качества. Собственное месторождение, белизна до 98%, доставка по России.',
    keywords: [
      'производитель мраморной крошки',
      'завод мраморного щебня',
      'месторождение мрамора',
      'зao амп',
      'производство щебня екатеринбург',
    ],
    alternates: {
      canonical: '/about',
    },
    openGraph: {
      title: 'О компании | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
      description: 'Производитель белой мраморной крошки и щебня. Собственное месторождение.',
      url: '/about',
    },
  }
}

// Metadata для страницы контактов
export function generateContactsMetadata(): Metadata {
  return {
    title: 'Контакты | Мраморная крошка Екатеринбург | ЗАО АМП',
    description: 'Контакты ЗАО АМП ИМПОРТ-ЭКСПОРТ. Телефон: +7 (919) 393-19-92. Адрес: Екатеринбург, ул. Евгения Савкова 29. WhatsApp, Telegram.',
    keywords: [
      'мраморная крошка екатеринбург',
      'контакты производителя щебня',
      'купить щебень телефон',
      'завод мраморной крошки адрес',
    ],
    alternates: {
      canonical: '/contacts',
    },
    openGraph: {
      title: 'Контакты | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
      description: 'Телефон: +7 (919) 393-19-92. Екатеринбург, ул. Евгения Савкова 29.',
      url: '/contacts',
    },
  }
}

// Metadata для страницы доставки
export function generateDeliveryMetadata(): Metadata {
  return {
    title: 'Доставка щебня по России | Условия и цены | ЗАО АМП',
    description: 'Доставка мраморной крошки и щебня по всей России. Автотранспорт и ж/д перевозки. Расчет стоимости доставки онлайн.',
    keywords: [
      'доставка щебня по россии',
      'доставка мраморной крошки',
      'перевозка щебня',
      'доставка щебня екатеринбург',
      'жд перевозки щебня',
    ],
    alternates: {
      canonical: '/delivery',
    },
    openGraph: {
      title: 'Доставка щебня по России | ЗАО АМП',
      description: 'Доставка мраморной крошки и щебня по всей России. Авто и ж/д.',
      url: '/delivery',
    },
  }
}

// Metadata для страницы документов
export function generateDocumentsMetadata(): Metadata {
  return {
    title: 'Документы и сертификаты | ЗАО АМП',
    description: 'Сертификаты качества, паспорта безопасности и другие документы на мраморную крошку и щебень от ЗАО АМП.',
    keywords: [
      'сертификат мраморной крошки',
      'паспорт безопасности щебень',
      'документы производителя',
    ],
    alternates: {
      canonical: '/documents',
    },
    openGraph: {
      title: 'Документы и сертификаты | ЗАО АМП',
      description: 'Сертификаты качества и паспорта безопасности.',
      url: '/documents',
    },
  }
}
