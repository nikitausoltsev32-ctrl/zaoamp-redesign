import { featuredProducts } from '@/lib/data/products'
import { ProductCard } from '@/components/product-card'
import { SectionHeader } from '@/components/section-header'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/app-link'
import { ArrowRight } from 'lucide-react'

export function FeaturedProductsSection() {
  return (
    <section className="content-auto py-20 bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Популярная продукция"
          subtitle="Самые востребованные фракции мраморного щебня и крошки"
          centered
        />
        
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
            >
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/catalog">
              Все продукты
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
