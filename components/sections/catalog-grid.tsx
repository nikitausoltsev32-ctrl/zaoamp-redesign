'use client'

import { ProductCard } from '@/components/product-card'
import { Product } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { PackageX } from 'lucide-react'

interface CatalogGridProps {
  products: Product[]
}

export function CatalogGrid({ products }: CatalogGridProps) {
  return (
    <div className="py-12 bg-stone-50 min-h-[500px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="popLayout">
          {products.length > 0 ? (
            <motion.div 
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              layout
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    layout: { duration: 0.3 }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <PackageX className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Продукты не найдены
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Попробуйте изменить фильтры или посмотрите все продукты
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <motion.p 
          key={products.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Показано {products.length} {products.length === 1 ? 'продукт' : products.length < 5 ? 'продукта' : 'продуктов'}
        </motion.p>
      </div>
    </div>
  )
}
