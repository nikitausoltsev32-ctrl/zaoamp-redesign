import { cn } from '@/lib/utils'

interface PriceTagProps {
  price: number
  unit?: string
  size?: 'sm' | 'md' | 'lg'
  oldPrice?: number
  className?: string
}

export function PriceTag({ 
  price, 
  unit = '/тонна', 
  size = 'md', 
  oldPrice,
  className 
}: PriceTagProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl font-bold'
  }

  return (
    <div className={cn('flex flex-col items-end', className)}>
      {oldPrice && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(oldPrice)} ₽
        </span>
      )}
      <div className={cn('flex items-baseline gap-1 text-brand-sapphire', sizeClasses[size])}>
        <span>{formatPrice(price)} ₽</span>
        <span className="text-sm text-muted-foreground font-normal">{unit}</span>
      </div>
    </div>
  )
}
