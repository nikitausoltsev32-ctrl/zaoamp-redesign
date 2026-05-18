import type { Product } from '@/types'
import { products } from '@/lib/data/products'
import { COMPANY_NAME, SITE_NAME, SITE_URL, absoluteSiteUrl } from '@/lib/seo/metadata'

type PurchasableProduct = Product & { pricePerTon: number }

function escapeXml(value: string | number) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getFeedAvailability(product: Product) {
  const availability = product.availability ?? 'in_stock'
  const values: Record<NonNullable<Product['availability']>, string> = {
    in_stock: 'in_stock',
    preorder: 'preorder',
    out_of_stock: 'out_of_stock',
  }

  return values[availability]
}

function getProductType(category: Product['category']) {
  const labels: Record<Product['category'], string> = {
    scherb: 'Мраморный щебень',
    kroshka: 'Мраморная крошка',
    muika: 'Мраморная мука и микрокальцит',
    otsev: 'Мраморная мука и микрокальцит',
  }

  return labels[category]
}

function getProductUrl(product: Product) {
  return absoluteSiteUrl(`/product/${product.slug}/`)
}

function getImageUrl(product: Product) {
  return absoluteSiteUrl(product.image ?? '/logo.png')
}

function getPurchasableProducts(): PurchasableProduct[] {
  return products.filter(
    (product): product is PurchasableProduct =>
      typeof product.pricePerTon === 'number' && product.pricePerTon > 0
  )
}

function getFeedTitle(product: Product) {
  return `${product.name} за 1 тонну`
}

function getFeedDescription(product: Product) {
  const packaging = product.specifications.packaging.slice(0, 3).join(', ')
  const parts = [
    product.description,
    `Фракция: ${product.fraction}.`,
    packaging ? `Упаковка: ${packaging}.` : '',
    'Цена указана за 1 тонну без учета доставки.',
  ]

  return parts.filter(Boolean).join(' ')
}

export function generateGoogleProductsXml() {
  const items = getPurchasableProducts()
    .map((product) => {
      const price = `${product.pricePerTon.toFixed(2)} RUB`

      return `
    <item>
      <g:id>${escapeXml(product.slug)}</g:id>
      <g:title>${escapeXml(getFeedTitle(product))}</g:title>
      <g:description>${escapeXml(getFeedDescription(product))}</g:description>
      <g:link>${escapeXml(getProductUrl(product))}</g:link>
      <g:image_link>${escapeXml(getImageUrl(product))}</g:image_link>
      <g:availability>${getFeedAvailability(product)}</g:availability>
      <g:price>${escapeXml(price)}</g:price>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(SITE_NAME)}</g:brand>
      <g:mpn>${escapeXml(product.slug)}</g:mpn>
      <g:product_type>${escapeXml(getProductType(product.category))}</g:product_type>
    </item>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(COMPANY_NAME)} - товары</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml('Мраморная крошка, щебень, мука и микрокальцит от производителя')}</description>${items}
  </channel>
</rss>`
}

export function generateYandexYml() {
  const categories = [
    { id: 1, name: 'Мраморный щебень' },
    { id: 2, name: 'Мраморная крошка' },
    { id: 3, name: 'Мраморная мука и микрокальцит' },
  ]
  const categoryIds: Record<Product['category'], number> = {
    scherb: 1,
    kroshka: 2,
    muika: 3,
    otsev: 3,
  }
  const generatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00')
  const categoryXml = categories
    .map((category) => `<category id="${category.id}">${escapeXml(category.name)}</category>`)
    .join('')
  const offers = getPurchasableProducts()
    .map((product) => {
      const params: Array<[string, string | undefined]> = [
        ['Фракция', product.fraction],
        ['Материал', 'мрамор'],
        ['Упаковка', product.specifications.packaging.join(', ')],
        ['Белизна', product.specifications.whiteness],
        ['CaCO3', product.specifications.caco3],
      ]
      const visibleParams = params.filter(
        (param): param is [string, string] =>
          typeof param[1] === 'string' &&
          param[1].trim() !== '' &&
          param[1].toLowerCase() !== 'по запросу'
      )

      const paramsXml = visibleParams
        .map(([name, value]) => `<param name="${escapeXml(name)}">${escapeXml(value)}</param>`)
        .join('')

      return `
      <offer id="${escapeXml(product.slug)}" available="${getFeedAvailability(product) === 'in_stock' ? 'true' : 'false'}">
        <url>${escapeXml(getProductUrl(product))}</url>
        <price>${product.pricePerTon}</price>
        <currencyId>RUR</currencyId>
        <categoryId>${categoryIds[product.category]}</categoryId>
        <picture>${escapeXml(getImageUrl(product))}</picture>
        <name>${escapeXml(getFeedTitle(product))}</name>
        <vendor>${escapeXml(SITE_NAME)}</vendor>
        <model>${escapeXml(product.name)}</model>
        <description>${escapeXml(getFeedDescription(product))}</description>${paramsXml}
      </offer>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${generatedAt}">
  <shop>
    <name>${escapeXml(SITE_NAME)}</name>
    <company>${escapeXml(COMPANY_NAME)}</company>
    <url>${escapeXml(SITE_URL)}</url>
    <currencies>
      <currency id="RUR" rate="1"/>
    </currencies>
    <categories>${categoryXml}
    </categories>
    <offers>${offers}
    </offers>
  </shop>
</yml_catalog>`
}
