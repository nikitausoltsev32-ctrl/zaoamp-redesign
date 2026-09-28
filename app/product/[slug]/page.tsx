import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductHero } from '@/components/sections/product/product-hero'
import { ProductSpecs } from '@/components/sections/product/product-specs'
import { ProductApplications } from '@/components/sections/product/product-applications'
import { ProductCalculator } from '@/components/sections/product/product-calculator'
import { ProductCTA } from '@/components/sections/product/product-cta'
import { getProductBySlug, getAllProductSlugs } from '@/lib/utils/products'
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema, JsonLd } from '@/lib/seo/schema'
import { generateProductMetadata } from '@/lib/seo/metadata'
import { SeoLongContent } from '@/components/sections/seo-long-content'
import { ProductFaq } from '@/components/sections/product/product-faq'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/data/products'
import Link from '@/components/ui/app-link'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getAllProductSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Продукт не найден',
    }
  }

  return generateProductMetadata(product)
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const categoryMap: Record<string, { slug: string; label: string }> = {
    scherb: { slug: 'shcheben', label: 'Мраморный щебень' },
    kroshka: { slug: 'kroshka', label: 'Мраморная крошка' },
    muika: { slug: 'muka', label: 'Мука и микрокальцит' },
    otsev: { slug: 'muka', label: 'Мука и микрокальцит' },
    landshaft: { slug: 'landshaftnyj-kamen', label: 'Ландшафтный камень' },
  }
  const cat = categoryMap[product.category]
  const categoryAnchor: Record<string, string> = {
    kroshka: 'Мраморная крошка оптом от производителя — все 8 фракций',
    shcheben: 'Белый мраморный щебень оптом — все фракции',
    muka: 'Мраморная мука и микрокальцит — весь ассортимент',
  }
  const otherStones =
    product.category === 'landshaft'
      ? products.filter((p) => p.category === 'landshaft' && p.slug !== product.slug)
      : []

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: '/' },
    { name: 'Каталог', item: '/catalog' },
    ...(cat ? [{ name: cat.label, item: `/catalog/${cat.slug}` }] : []),
    { name: product.name, item: `/product/${product.slug}` },
  ])

  return (
    <div className="min-h-screen bg-brand-ice-blue">
      <JsonLd data={generateProductSchema(product)} />
      <JsonLd data={breadcrumb} />
      {product.faqs && product.faqs.length > 0 && (
        <JsonLd data={generateFAQSchema(product.faqs)} />
      )}
      <ProductHero product={product} categoryBreadcrumb={cat} />
      <ProductSpecs product={product} />
      <ProductApplications product={product} />
      {product.seoContent && (
        <section className="bg-white py-16">
          <SeoLongContent content={product.seoContent} className="" hideSpecs />
        </section>
      )}
      {product.faqs && <ProductFaq faqs={product.faqs} />}
      {otherStones.length > 0 && (
        <section className="bg-stone-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Другие породы</h2>
              <Link
                href="/catalog/landshaftnyj-kamen"
                className="text-sm font-medium text-brand-sapphire hover:underline"
              >
                Весь ландшафтный камень →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherStones.map((stone) => (
                <ProductCard key={stone.slug} product={stone} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}
      {cat && product.category !== 'landshaft' && (
        <section className="bg-white py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/catalog/${cat.slug}`}
              className="text-base font-medium text-brand-sapphire hover:underline"
            >
              {categoryAnchor[cat.slug]} →
            </Link>
          </div>
        </section>
      )}
      <ProductCalculator product={product} />
      <ProductCTA />
    </div>
  )
}
