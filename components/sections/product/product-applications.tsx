'use client'

import { Product } from '@/types'
import { SectionHeader } from '@/components/section-header'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Building2, 
  Trees, 
  Hammer, 
  Truck, 
  Home, 
  Leaf,
  Factory,
  Paintbrush
} from 'lucide-react'
import { motion } from 'framer-motion'

interface ProductApplicationsProps {
  product: Product
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'строительство': Building2,
  'ландшафт': Trees,
  'бетон': Hammer,
  'дороги': Truck,
  'фундамент': Home,
  'декор': Paintbrush,
  'сельское хозяйство': Leaf,
  'производство': Factory,
}

function getIconForApplication(application: string) {
  const lowercaseApp = application.toLowerCase()
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowercaseApp.includes(key)) return icon
  }
  return Building2
}

export function ProductApplications({ product }: ProductApplicationsProps) {
  return (
    <section className="py-16 bg-brand-ice-blue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Применение"
          subtitle="Основные сферы использования продукта"
          centered
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {product.applications.map((application, index) => {
            const Icon = getIconForApplication(application)
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full transition-shadow hover:shadow-lg group">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-sapphire/10 text-brand-sapphire transition-colors group-hover:bg-brand-sapphire group-hover:text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {application}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
