'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/lib/seo/schema'
import { CatalogHeader } from '@/components/sections/catalog-header'
import { CatalogFilters, CategoryFilter } from '@/components/sections/catalog-filters'
import { CatalogGrid } from '@/components/sections/catalog-grid'
import { products } from '@/lib/data/products'

const CATEGORY_CARDS = [
  {
    href: '/catalog/shcheben',
    title: 'Мраморный щебень',
    description: 'Фракции 10-20, 20-50, 50-200 мм. Белизна 98%, радиационный класс I, кубовидная форма.',
    badge: '3 фракции',
  },
  {
    href: '/catalog/kroshka',
    title: 'Мраморная крошка',
    description: '8 фракций от 0-1 до 5-10 мм. Для ландшафта, штукатурки, наливных полов и декора.',
    badge: '8 фракций',
  },
  {
    href: '/catalog/muka',
    title: 'Мука и микрокальцит',
    description: '0-0,2 мм и 5-200 мкм. CaCO₃ 98%, белизна 98%. Для ЛКМ, пластиков, сельского хозяйства.',
    badge: '2 вида',
  },
]

export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all')

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products
    return products.filter(product => product.category === activeFilter)
  }, [activeFilter])

  const productCounts = useMemo(() => ({
    all: products.length,
    scherb: products.filter(p => p.category === 'scherb').length,
    kroshka: products.filter(p => p.category === 'kroshka').length,
    muika: products.filter(p => p.category === 'muika' || p.category === 'otsev').length,
  }), [])

  return (
    <>
      <JsonLd data={{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Главная","item":"https://amp-minerals.ru"},{"@type":"ListItem","position":2,"name":"Каталог","item":"https://amp-minerals.ru/catalog"}]}} />
      <div className="min-h-screen bg-brand-ice-blue">
        <CatalogHeader />

        {/* Категории */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col bg-white rounded-xl border border-stone-200 p-5 hover:border-brand-sapphire/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-brand-sapphire bg-brand-sapphire/10 px-2.5 py-1 rounded-full">
                    {cat.badge}
                  </span>
                  <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-brand-sapphire group-hover:translate-x-0.5 transition-all" />
                </div>
                <h2 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-sapphire transition-colors">
                  {cat.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <CatalogFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          productCounts={productCounts}
        />
        <CatalogGrid products={filteredProducts} />
      </div>
    </>
  )
}