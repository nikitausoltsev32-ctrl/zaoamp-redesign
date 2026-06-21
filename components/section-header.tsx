import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  withLine?: boolean
  inverted?: boolean
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  centered = false,
  withLine = false,
  inverted = false,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-8 md:mb-12',
      centered && 'text-center',
      className
    )}>
      <h2 className={cn(
        'font-serif font-bold',
        inverted ? 'text-white' : 'text-foreground',
        'text-2xl md:text-3xl lg:text-4xl',
        'mb-3'
      )}>
        {title}
      </h2>

      {withLine && (
        <div className={cn(
          'w-16 h-1 bg-brand-sapphire rounded-full mb-4',
          centered && 'mx-auto'
        )} />
      )}

      {subtitle && (
        <p className={cn(
          'text-base md:text-lg max-w-2xl',
          inverted ? 'text-white/80' : 'text-muted-foreground'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
