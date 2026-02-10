'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CategoryFilter = 'all' | 'scherb' | 'kroshka' | 'muika'

interface FilterOption {
  value: CategoryFilter
  label: string
  count: number
}

interface CatalogFiltersProps {
  activeFilter: CategoryFilter
  onFilterChange: (filter: CategoryFilter) => void
  productCounts: Record<CategoryFilter, number>
}

const filters: FilterOption[] = [
  { value: 'all', label: 'Все продукты', count: 6 },
  { value: 'scherb', label: 'Щебень', count: 3 },
  { value: 'kroshka', label: 'Крошка', count: 2 },
  { value: 'muika', label: 'Мука', count: 1 },
]

export function CatalogFilters({ activeFilter, onFilterChange, productCounts }: CatalogFiltersProps) {
  return (
    <div className="py-6 border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                'gap-2',
                activeFilter === filter.value && 'bg-brand-orange hover:bg-brand-gold'
              )}
            >
              {filter.label}
              <span className={cn(
                'ml-1 rounded-full px-2 py-0.5 text-xs',
                activeFilter === filter.value 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
              )}>
                {productCounts[filter.value] || filter.count}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
