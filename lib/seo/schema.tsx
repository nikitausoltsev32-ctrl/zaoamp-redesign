import { Product } from '@/types'

// Organization Schema (для layout.tsx)
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    alternateName: 'АМП',
    url: 'https://zaoamp.ru',
    logo: {
      '@type': 'ImageObject',
      url: 'https://zaoamp.ru/logo.png',
      width: 512,
      height: 512,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-919-393-19-92',
      contactType: 'sales',
      areaServed: 'RU',
      availableLanguage: ['Russian'],
    },
    sameAs: [
      'https://t.me/usolst',
      // Добавить социальные сети при наличии
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Евгения Савкова 29, офис 262',
      addressLocality: 'Екатеринбург',
      addressRegion: 'Свердловская область',
      postalCode: '620144',
      addressCountry: 'RU',
    },
  }
}

// LocalBusiness Schema (для страницы контактов)
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    alternateName: 'АМП',
    description: 'Производитель белой мраморной крошки и щебня премиум-качества',
    url: 'https://zaoamp.ru',
    telephone: '+7-919-393-19-92',
    email: 'evoprod@mail.ru',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Евгения Савкова 29, офис 262',
      addressLocality: 'Екатеринбург',
      addressRegion: 'Свердловская область',
      postalCode: '620144',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 56.8389,
      longitude: 60.6057,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    image: {
      '@type': 'ImageObject',
      url: 'https://zaoamp.ru/logo.png',
    },
    priceRange: '$$',
    areaServed: 'RU',
  }
}

// Product Schema (для страницы продукта)
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `https://zaoamp.ru${product.image}`,
    brand: {
      '@type': 'Brand',
      name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    },
    offers: {
      '@type': 'Offer',
      url: `https://zaoamp.ru/product/${product.slug}`,
      price: product.pricePerTon,
      priceCurrency: 'RUB',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'RUB',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'RU',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
  }
}

// BreadcrumbList Schema (для навигации)
export function generateBreadcrumbSchema(
  items: Array<{ name: string; item: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://zaoamp.ru${item.item}`,
    })),
  }
}

// WebSite Schema (для поисковой строки)
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    url: 'https://zaoamp.ru',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://zaoamp.ru/catalog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// FAQPage Schema
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Helper function для вставки JSON-LD в страницу
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
