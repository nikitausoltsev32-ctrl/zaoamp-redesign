import { motion } from 'framer-motion'
import { Benefit } from '@/lib/data/benefits'
import { Card, CardContent } from '@/components/ui/card'

interface BenefitCardProps {
  benefit: Benefit
  index: number
}

export function BenefitCard({ benefit, index }: BenefitCardProps) {
  const Icon = benefit.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
        <CardContent className="p-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange transition-colors group-hover:bg-brand-orange group-hover:text-white">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">
            {benefit.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {benefit.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
