import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductHero } from '@/components/sections/product/product-hero'
import { ProductSpecs } from '@/components/sections/product/product-specs'
import { ProductApplications } from '@/components/sections/product/product-applications'
import { ProductCalculator } from '@/components/sections/product/product-calculator'
import { ProductCTA } from '@/components/sections/product/product-cta'
import { getProductBySlug, getAllProductSlugs } from '@/lib/utils/products'

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

  return {
    title: product.seo.title,
    description: product.seo.description,
    keywords: product.seo.keywords,
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductHero product={product} />
      <ProductSpecs product={product} />
      <ProductApplications product={product} />
      <ProductCalculator product={product} />
      <ProductCTA />
    </div>
  )
}
