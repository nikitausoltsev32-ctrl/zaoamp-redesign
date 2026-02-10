import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'О компании АМП ИМПОРТ-ЭКСПОРТ | Производитель мраморной крошки',
  description: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ — производитель белой мраморной крошки и щебня премиум-качества. Собственное месторождение, доставка по России.',
  keywords: ['о компании', 'производитель мрамора', 'месторождение мрамора', 'ЗАО АМП'],
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
