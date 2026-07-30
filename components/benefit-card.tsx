import { Benefit } from '@/lib/data/benefits'

interface BenefitCardProps {
  benefit: Benefit
  index: number
  className?: string
}

export function BenefitCard({ benefit, className = '' }: BenefitCardProps) {
  const Icon = benefit.icon

  return (
    <div
      className={`relative h-full ${className}`}
    >
      <div
        className="group relative h-full overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand-sapphire/30 hover:shadow-lg"
      >
        <div className="relative z-10 flex h-full flex-col">
          <div
            className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-sapphire/5 to-brand-sapphire/20 text-brand-sapphire transition-colors group-hover:from-brand-sapphire group-hover:to-brand-sapphire-light group-hover:text-white"
          >
            <Icon className="h-7 w-7" />
          </div>

          <h3 className="mb-3 font-bold text-foreground md:text-lg">
            {benefit.title}
          </h3>
          <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
            {benefit.description}
          </p>
        </div>
      </div>
    </div>
  )
}
