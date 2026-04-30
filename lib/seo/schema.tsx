import type { Product } from '@/types'
import { COMPANY_NAME, SITE_NAME, SITE_URL } from '@/lib/seo/metadata'

function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}

function normalizeValue(value?: string) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.toLowerCase() === 'по запросу') {
    return undefined
  }
  return trimmed
}

function getCategoryName(category: Product['category']) {
  const labels: Record<Product['category'], string> = {
    scherb: 'Мраморный щебень',
    kroshka: 'Мраморная крошка',
    muika: 'Мраморная мука и микрокальцит',
    otsev: 'Мраморная мука и микрокальцит',
  }

  return labels[category]
}

function getProductAdditionalProperties(product: Product) {
  const properties = [
    { name: 'Фракция', value: product.fraction },
    { name: 'Белизна', value: normalizeValue(product.specifications.whiteness) },
    { name: 'CaCO3', value: normalizeValue(product.specifications.caco3) },
    {
      name: 'Упаковка',
      value: product.specifications.packaging.length
        ? product.specifications.packaging.join(', ')
        : undefined,
    },
    { name: 'Плотность', value: normalizeValue(product.specifications.density) },
    { name: 'Морозостойкость', value: normalizeValue(product.specifications.frostResistance) },
  ]
    .filter((property) => property.value)
    .map((property) => ({
      '@type': 'PropertyValue',
      name: property.name,
      value: property.value,
    }))

  return properties.length > 0 ? properties : undefined
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_NAME,
    alternateName: SITE_NAME,
    brand: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    email: 'evoprod@mail.ru',
    telephone: '+7-919-393-19-92',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Евгения Савкова 29, офис 262',
      addressLocality: 'Екатеринбург',
      addressRegion: 'Свердловская область',
      postalCode: '620144',
      addressCountry: 'RU',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-919-393-19-92',
      contactType: 'sales',
      areaServed: 'RU',
      availableLanguage: 'ru',
    },
    sameAs: ['https://t.me/usolst'],
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY_NAME,
    url: SITE_URL,
    email: 'evoprod@mail.ru',
    telephone: '+7-919-393-19-92',
    image: absoluteUrl('/logo.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Евгения Савкова 29, офис 262',
      addressLocality: 'Екатеринбург',
      addressRegion: 'Свердловская область',
      postalCode: '620144',
      addressCountry: 'RU',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 56.8389,
      longitude: 60.6057,
    },
  }
}

export function generateProductSchema(product: Product) {
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    url: absoluteUrl(`/product/${product.slug}`),
    priceCurrency: 'RUB',
    seller: {
      '@type': 'Organization',
      name: COMPANY_NAME,
    },
  }

  if (typeof product.pricePerTon === 'number') {
    offer.price = product.pricePerTon
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: getCategoryName(product.category),
    offers: offer,
    additionalProperty: getProductAdditionalProperties(product),
  }

  if (product.image) {
    schema.image = absoluteUrl(product.image)
  }

  return schema
}

export function generateBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item.startsWith('http') ? item.item : absoluteUrl(item.item),
    })),
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
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

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
