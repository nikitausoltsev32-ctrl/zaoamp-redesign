# Phase 05, Plan 02: SEO & Meta Tags

## Metadata
```yaml
phase: "05"
plan: "02"
wave: 5
depends_on: ["05-01"]
files_modified:
  - app/layout.tsx
  - app/**/page.tsx
  - lib/seo/
autonomous: true
```

## Objective
Настроить SEO: мета-теги, Open Graph, Schema.org разметку, robots.txt, sitemap.xml для всех страниц.

## Target Keywords

| Запрос | Страница | Приоритет |
|--------|----------|-----------|
| мраморная крошка купить | /catalog, главная | Высокий |
| мраморный щебень екатеринбург | /catalog, продукты | Высокий |
| белый щебень цена | /catalog, продукты | Высокий |
| мраморная мука купить | /product/mramornaya-muka-0-0-2 | Средний |
| щебень 20-50 купить | /product/mramornyj-shheben-20-50 | Средний |
| доставка щебня по россии | /delivery | Средний |

## must_haves
```yaml
truths:
  - "Мета-теги unique для каждой страницы"
  - "Open Graph tags настроены"
  - "Schema.org разметка присутствует"
  - "Robots.txt и sitemap.xml созданы"
  - "Canonical URLs установлены"
  - "Все целевые ключевые запросы учтены в metadata"

artifacts:
  - path: "app/layout.tsx"
    provides: "Базовые мета-теги"
    min_lines: 60
  - path: "lib/seo/metadata.ts"
    provides: "SEO утилиты"
    min_lines: 50
  - path: "public/robots.txt"
    provides: "Robots.txt"
    min_lines: 10
  - path: "public/sitemap.xml"
    provides: "Карта сайта"
    min_lines: 40
  - path: "app/opengraph-image.tsx"
    provides: "Open Graph изображение"
    min_lines: 30

key_links:
  - from: "app/page.tsx"
    to: "lib/seo/metadata.ts"
    via: "import { generateMetadata }"
  - from: "app/product/[slug]/page.tsx"
    to: "lib/seo/metadata.ts"
    via: "export const metadata = generateProductMetadata"
```

## Tasks

<task type="auto">
  <name>Task 1: Create SEO Utilities</name>
  <files>
    - lib/seo/metadata.ts
    - lib/seo/schema.ts
  </files>
  <action>
    1. Create lib/seo/metadata.ts:
       - Default metadata object
       - generateMetadata helpers for:
         - Home page
         - Catalog page
         - Product pages (dynamic)
         - About, Contacts, Delivery
       - Open Graph defaults
       - Twitter Card defaults
    2. Create lib/seo/schema.ts:
       - JSON-LD generators:
         - Organization schema
         - Product schema
         - LocalBusiness schema
         - BreadcrumbList schema
       - Types for all schemas
  </action>
  <verify>
    - Utilities export functions
    - TypeScript types correct
    - All page types covered
  </verify>
  <done>SEO утилиты созданы</done>
</task>

<task type="auto">
  <name>Task 2: Configure Root Metadata</name>
  <files>
    - app/layout.tsx
  </files>
  <action>
    1. Update app/layout.tsx metadata:
       - title: { template: '%s | АМП ИМПОРТ-ЭКСПОРТ', default: 'Мраморная крошка и щебень | АМП ИМПОРТ-ЭКСПОРТ' }
       - description: "Производитель белой мраморной крошки и щебня..."
       - keywords: ["мраморная крошка", "мраморный щебень", "Екатеринбург"]
       - authors, creator
       - metadataBase: new URL('https://zaoamp.ru')
       - openGraph: default settings
       - twitter: card, site
       - robots: index, follow
       - icons: favicon
    2. Add Organization schema JSON-LD
  </action>
  <verify>
    - Metadata exports correctly
    - Title template works
    - OG tags present
  </verify>
  <done>Корневые мета-теги настроены</done>
</task>

<task type="auto">
  <name>Task 3: Add Page-Specific Metadata</name>
  <files>
    - app/page.tsx
    - app/catalog/page.tsx
    - app/product/[slug]/page.tsx
    - app/about/page.tsx
    - app/contacts/page.tsx
    - app/delivery/page.tsx
  </files>
  <action>
    1. Update each page with metadata using target keywords:
       - Home: "Мраморная крошка и щебень | АМП ИМПОРТ-ЭКСПОРТ" — keywords: мраморная крошка купить, белый щебень
       - Catalog: "Каталог мраморной крошки и щебня | АМП" — keywords: мраморный щебень екатеринбург, белый щебень цена
       - Product: dynamic from product data with fraction-specific keywords (e.g., "щебень 20-50 купить")
       - About: company keywords — "Производитель мраморной крошки | ЗАО АМП"
       - Contacts: local business keywords — "Контакты | Мраморная крошка Екатеринбург"
       - Delivery: delivery keywords — "Доставка щебня по России | АМП"
     2. Generate metadata function where needed
     3. Add JSON-LD schema to each page
     4. Ensure all target keywords from table above are incorporated
   </action>
  <verify>
    - Each page has unique title
    - Product pages dynamic metadata
    - Schemas validate
  </verify>
  <done>Мета-теги для всех страниц</done>
</task>

<task type="auto">
  <name>Task 4: Create Open Graph Image</name>
  <files>
    - app/opengraph-image.tsx
    - app/twitter-image.tsx
  </files>
  <action>
    1. Create app/opengraph-image.tsx:
       - Use ImageResponse from next/og
       - Design OG image template:
         - Company logo
         - Product image or brand colors
         - Title and description
         - 1200x630 size
    2. Create app/twitter-image.tsx (similar)
    3. Test OG image generation
  </action>
  <verify>
    - OG image generates at /opengraph-image
    - Image is 1200x630
    - Text readable
  </verify>
  <done>Open Graph изображение создано</done>
</task>

<task type="auto">
  <name>Task 5: Create Robots.txt and Sitemap</name>
  <files>
    - public/robots.txt
    - app/sitemap.ts
  </files>
  <action>
    1. Create public/robots.txt:
       - User-agent: *
       - Allow: /
       - Disallow: /api/
       - Sitemap: https://zaoamp.ru/sitemap.xml
    2. Create app/sitemap.ts:
       - Generate sitemap with all routes
       - Include: home, catalog, products (all 6), about, contacts, delivery
       - Add lastModified, changeFrequency, priority
       - Use getAllProductSlugs() for dynamic routes
  </action>
  <verify>
    - /robots.txt accessible
    - /sitemap.xml generates correctly
    - All URLs present
  </verify>
  <done>Robots и Sitemap созданы</done>
</task>

<task type="auto">
  <name>Task 6: Add Structured Data</name>
  <files>
    - app/layout.tsx
    - app/product/[slug]/page.tsx
    - app/contacts/page.tsx
  </files>
  <action>
    1. Add Organization schema to layout:
       - @type: Organization
       - name, url, logo
       - contactPoint (telephone, contactType)
       - sameAs (social profiles)
    2. Add Product schema to product pages:
       - @type: Product
       - name, image, description, brand
       - offers: price, priceCurrency, availability
    3. Add LocalBusiness to contacts:
       - @type: LocalBusiness
       - name, address, geo, telephone
  </action>
  <verify>
    - Schema.org valid JSON-LD
    - Google Rich Results compatible
    - Testing tool validates
  </verify>
  <done>Структурированные данные добавлены</done>
</task>

## Verification Criteria

1. **Мета-теги:** Unique для каждой страницы
2. **Open Graph:** tags present, image generates
3. **Schema.org:** Organization, Product, LocalBusiness
4. **Robots.txt:** Allow all, sitemap referenced
5. **Sitemap:** All pages included
6. **Canonical:** URLs canonicalized

## Success Criteria
- [ ] SEO утилиты
- [ ] Корневые мета-теги
- [ ] Мета-теги для всех страниц
- [ ] Open Graph изображение
- [ ] Robots.txt
- [ ] Sitemap.xml
- [ ] Schema.org разметка

---

## Code Examples & References

### Sitemap Example (app/sitemap.ts)
```typescript
import { MetadataRoute } from 'next'
import { getAllProductSlugs } from '@/lib/utils/products'

const BASE_URL = 'https://zaoamp.ru'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllProductSlugs()
  const productUrls = slugs.map((slug) => ({
    url: `${BASE_URL}/product/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/catalog/`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/delivery/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contacts/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...productUrls,
  ]
}
```

### Schema.org Examples

#### Organization (app/layout.tsx)
```typescript
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
  url: 'https://zaoamp.ru',
  logo: 'https://zaoamp.ru/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+7-919-393-19-92',
    contactType: 'sales',
    areaServed: 'RU',
  },
}
```

#### Product Schema
```typescript
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'RUB',
    availability: 'https://schema.org/InStock',
  },
}
```

#### LocalBusiness (app/contacts/page.tsx)
```typescript
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Евгения Савкова 29, офис 262',
    addressLocality: 'Екатеринбург',
    addressCountry: 'RU',
  },
  telephone: '+7-919-393-19-92',
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 56.8389,
    longitude: 60.6057,
  },
}
```

### Metadata Template
```typescript
export const metadata = {
  title: 'Мраморная крошка и щебень | АМП ИМПОРТ-ЭКСПОРТ',
  description: 'Производитель белой мраморной крошки и щебня. Доставка по России. Белизна 98%. От 2900 ₽/тонна.',
  keywords: ['мраморная крошка', 'мраморный щебень', 'белый щебень', 'Екатеринбург'],
  metadataBase: new URL('https://zaoamp.ru'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://zaoamp.ru',
    siteName: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Мраморная крошка и щебень | ЗАО АМП',
  },
  robots: { index: true, follow: true },
}
```

---

## Pre-Launch Checklist

- [ ] Указать реальный BASE_URL / metadataBase (https://zaoamp.ru)
- [ ] Создать og-image 1200×630 (public/images/og-image.jpg)
- [ ] Добавить домен в Google Search Console
- [ ] Добавить домен в Yandex Webmaster
- [ ] Проверить sitemap в валидаторе (https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [ ] Проверить JSON-LD в Google Rich Results Test (https://search.google.com/test/rich-results)
- [ ] Проверить все canonical URLs
- [ ] Проверить meta tags на всех страницах
- [ ] Проверить Open Graph через Facebook Debugger
- [ ] Проверить скорость загрузки (PageSpeed Insights)
