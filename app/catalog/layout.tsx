import type { Metadata } from 'next'
import { products } from '@/lib/data/products'
import { generateCatalogMetadata } from '@/lib/seo/metadata'

const minCatalogPrice = products
  .map((product) => product.pricePerTon)
  .filter((price): price is number => typeof price === 'number')
  .sort((a, b) => a - b)[0]

export const metadata: Metadata = generateCatalogMetadata(products.length, minCatalogPrice)

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
