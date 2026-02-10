import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  withLine?: boolean
  className?: string
}

export function SectionHeader({ 
  title, 
  subtitle, 
  centered = false, 
  withLine = false,
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-8 md:mb-12',
      centered && 'text-center',
      className
    )}>
      <h2 className={cn(
        'font-serif font-bold text-stone-900',
        'text-2xl md:text-3xl lg:text-4xl',
        'mb-3'
      )}>
        {title}
      </h2>
      
      {withLine && (
        <div className={cn(
          'w-16 h-1 bg-brand-orange rounded-full mb-4',
          centered && 'mx-auto'
        )} />
      )}
      
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
