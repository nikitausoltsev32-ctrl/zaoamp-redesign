import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductHero } from '@/components/sections/product/product-hero'
import { ProductSpecs } from '@/components/sections/product/product-specs'
import { ProductApplications } from '@/components/sections/product/product-applications'
import { ProductCalculator } from '@/components/sections/product/product-calculator'
import { ProductCTA } from '@/components/sections/product/product-cta'
import { getProductBySlug, getAllProductSlugs } from '@/lib/utils/products'
import { generateProductSchema, generateBreadcrumbSchema, JsonLd } from '@/lib/seo/schema'
import { generateProductMetadata } from '@/lib/seo/metadata'

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
  }
  const cat = categoryMap[product.category]

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
      <ProductHero product={product} categoryBreadcrumb={cat} />
      <ProductSpecs product={product} />
      <ProductApplications product={product} />
      <ProductCalculator product={product} />
      <ProductCTA />
    </div>
  )
}
