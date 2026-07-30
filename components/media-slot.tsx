import { ImageIcon } from 'lucide-react'

interface MediaSlotProps {
  title: string
  caption: string
  className?: string
}

export function MediaSlot({ title, caption, className = '' }: MediaSlotProps) {
  return (
    <figure
      className={`flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-100/80 px-6 py-10 text-center ${className}`}
      aria-label={`${title}. ${caption}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-sapphire shadow-sm">
        <ImageIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      <figcaption className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}
