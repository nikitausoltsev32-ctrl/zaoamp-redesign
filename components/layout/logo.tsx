import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  /** variant="dark" — белый лого для тёмного фона (footer) */
  variant?: 'default' | 'dark'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', variant = 'default', showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
    xxl: 'h-24',
  }

  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      <Image
        src="/logo.png"
        alt="АМП ИМПОРТ-ЭКСПОРТ"
        width={160}
        height={60}
        className={cn(
          'w-auto object-contain',
          sizeClasses[size],
          variant === 'dark' && 'brightness-0 invert'
        )}
        priority
      />
    </Link>
  )
}
