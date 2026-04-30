import type { Metadata } from 'next'
import { CategoryPageTemplate } from '@/components/sections/category-page-template'
import { categories, getCategoryProducts } from '@/lib/data/categories'
import { generateCategoryMetadata } from '@/lib/seo/metadata'

const data = categories.muka

export const metadata: Metadata = generateCategoryMetadata(data, getCategoryProducts(data.slug))

export default function MukaCategoryPage() {
  return <CategoryPageTemplate data={data} />
}
