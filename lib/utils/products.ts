import { products } from '@/lib/data/products'
import { Product } from '@/types'

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

export function getAllProductSlugs(): string[] {
  return products.map(product => product.slug)
}

export function getRelatedProducts(currentSlug: string, limit: number = 3): Product[] {
  const currentProduct = getProductBySlug(currentSlug)
  if (!currentProduct) return []

  return products
    .filter(product => 
      product.slug !== currentSlug && 
      (product.category === currentProduct.category || 
       product.applications.some(app => currentProduct.applications.includes(app)))
    )
    .slice(0, limit)
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(product => product.category === category)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price)
}

export function getCategoryLabel(category: Product['category']): string {
  const labels: Record<Product['category'], string> = {
    scherb: 'Щебень',
    kroshka: 'Крошка',
    muika: 'Мраморная мука',
    otsev: 'Отсев'
  }
  return labels[category] || category
}
