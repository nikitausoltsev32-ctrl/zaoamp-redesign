import type { Product } from '@/types'
import type { Author } from '@/lib/data/authors'
import type { BlogPost } from '@/lib/data/blog'
import { COMPANY_NAME, SITE_NAME, SITE_URL } from '@/lib/seo/metadata'

function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}

function withTrailingSlash(path: string) {
  if (path === '/' || path.endsWith('/')) return path
  return `${path}/`
}

function productUrl(product: Product) {
  return absoluteUrl(`/product/${product.slug}/`)
}

function getSchemaAvailability(product: Product) {
  const availability = product.availability ?? 'in_stock'
  const values: Record<NonNullable<Product['availability']>, string> = {
    in_stock: 'https://schema.org/InStock',
    preorder: 'https://schema.org/PreOrder',
    out_of_stock: 'https://schema.org/OutOfStock',
  }

  return values[availability]
}

function getPriceValidUntil() {
  const date = new Date()
  date.setMonth(date.getMonth() + 6)
  return date.toISOString().slice(0, 10)
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
    foundingDate: '2004',
    description:
      'Производитель белой мраморной крошки, щебня и микрокальцита с собственным карьером в Челябинской области. 20+ лет на рынке, поставки по России, Беларуси и Казахстану.',
    areaServed: ['RU', 'BY', 'KZ'],
    knowsAbout: [
      'Мраморная крошка',
      'Мраморный щебень',
      'Микрокальцит',
      'Мраморная мука',
      'Нерудные строительные материалы',
      'Ландшафтный дизайн',
      'Архитектурный бетон',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Каталог мраморной продукции',
      url: absoluteUrl('/catalog/'),
    },
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
    sameAs: [
      'https://t.me/usolst',
      'https://yandex.ru/maps/org/amp_import_eksport/170350594774/',
    ],
  }
}

export function generateLocalBusinessSchema(areaServed?: string) {
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
      latitude: 56.790945,
      longitude: 60.487171,
    },
    sameAs: [
      'https://t.me/usolst',
      'https://yandex.ru/maps/org/amp_import_eksport/170350594774/',
    ],
    ...(areaServed
      ? { areaServed: { '@type': 'City', name: areaServed } }
      : {}),
  }
}

export function generateProductSchema(product: Product) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.slug,
    mpn: product.slug,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: COMPANY_NAME,
    },
    category: getCategoryName(product.category),
    additionalProperty: getProductAdditionalProperties(product),
  }

  if (typeof product.pricePerTon === 'number') {
    schema.offers = {
      '@type': 'Offer',
      url: productUrl(product),
      priceCurrency: 'RUB',
      price: product.pricePerTon,
      priceValidUntil: getPriceValidUntil(),
      availability: getSchemaAvailability(product),
      seller: {
        '@type': 'Organization',
        name: COMPANY_NAME,
      },
    }
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
      item: item.item.startsWith('http') ? item.item : absoluteUrl(withTrailingSlash(item.item)),
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

export function generateArticleSchema(post: BlogPost, author: Author) {
  const articleUrl = absoluteUrl(`/blog/${post.slug}/`)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.h1,
    description: post.excerpt,
    url: articleUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl('/images/products/kroshka-5-10.jpg'),
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.role,
      worksFor: {
        '@type': 'Organization',
        name: COMPANY_NAME,
        url: SITE_URL,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
    },
  }
}

export function generateItemListSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/product/${product.slug}/`),
      name: product.name,
    })),
  }
}

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>
}) {
  // Security: Escaping '<' to prevent XSS vulnerability when rendering JSON-LD
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
