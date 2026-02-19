'use client'

import { useState, useMemo } from 'react'
import { CatalogHeader } from '@/components/sections/catalog-header'
import { CatalogFilters, CategoryFilter } from '@/components/sections/catalog-filters'
import { CatalogGrid } from '@/components/sections/catalog-grid'
import { products } from '@/lib/data/products'

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
    <div className="min-h-screen bg-brand-ice-blue">
      <CatalogHeader />
      <CatalogFilters 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter}
        productCounts={productCounts}
      />
      <CatalogGrid products={filteredProducts} />
    </div>
  )
}
