import type { Metadata } from 'next'
import { CategoryPageTemplate } from '@/components/sections/category-page-template'
import { categories, getCategoryProducts } from '@/lib/data/categories'
import { generateCategoryMetadata } from '@/lib/seo/metadata'

const data = categories.kroshka

export const metadata: Metadata = generateCategoryMetadata(data, getCategoryProducts(data.slug))

export default function KroshkaCategoryPage() {
  return <CategoryPageTemplate data={data} />
}
