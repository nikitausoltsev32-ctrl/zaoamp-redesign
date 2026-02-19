import { Phone, MessageCircle, Clock } from 'lucide-react'
import { contactInfo } from '@/lib/data/contacts'
import { cn } from '@/lib/utils'

interface ContactBarProps {
  variant?: 'header' | 'footer' | 'mobile'
  className?: string
}

export function ContactBar({ variant = 'header', className }: ContactBarProps) {
  const phoneLink = `tel:${contactInfo.whatsapp}`
  const whatsappLink = `https://wa.me/${contactInfo.whatsapp}`

  if (variant === 'mobile') {
    return (
      <div className={cn('space-y-4', className)}>
        <a
          href={phoneLink}
          className="flex items-center gap-3 text-lg font-medium"
        >
          <Phone className="w-5 h-5 text-brand-sapphire" />
          {contactInfo.phone}
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-lg"
        >
          <MessageCircle className="w-5 h-5 text-purple-500" />
          MAX
        </a>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {contactInfo.workingHours}
        </div>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className={cn('space-y-3', className)}>
        <a
          href={phoneLink}
          className="flex items-center gap-2 text-stone-100 hover:text-brand-powder-blue transition-colors"
        >
          <Phone className="w-4 h-4" />
          {contactInfo.phone}
        </a>
        <a
          href={`mailto:${contactInfo.email}`}
          className="flex items-center gap-2 text-stone-300 hover:text-stone-100 transition-colors"
        >
          {contactInfo.email}
        </a>
        <div className="flex items-start gap-2 text-sm text-stone-400">
          {contactInfo.address}
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-400">
          <Clock className="w-4 h-4" />
          {contactInfo.workingHours}
        </div>
      </div>
    )
  }

  // header variant (default)
  return (
    <div className={cn('hidden lg:flex items-center gap-4', className)}>
      <div className="text-right">
        <a
          href={phoneLink}
          className="block text-lg font-bold text-stone-900 hover:text-brand-sapphire transition-colors"
        >
          {contactInfo.phone}
        </a>
        <span className="text-xs text-muted-foreground">{contactInfo.workingHours}</span>
      </div>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
        aria-label="Написать в MAX"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
    </div>
  )
}
