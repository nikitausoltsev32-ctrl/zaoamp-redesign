import type { Metadata } from 'next'
import { CategoryPageTemplate } from '@/components/sections/category-page-template'
import { categories } from '@/lib/data/categories'

const data = categories.muka

export const metadata: Metadata = {
  title: data.seo.title,
  description: data.seo.description,
  keywords: data.seo.keywords,
  alternates: { canonical: `/catalog/${data.slug}` },
  openGraph: {
    title: data.seo.title,
    description: data.seo.description,
    url: `/catalog/${data.slug}`,
  },
}

export default function MukaCategoryPage() {
  return <CategoryPageTemplate data={data} />
}
