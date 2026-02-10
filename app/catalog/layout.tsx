import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог мраморной крошки и щебня | Цены от 2 900 ₽/т',
  description: 'Все фракции мраморной крошки и щебня от производителя ЗАО АМП. Щебень 10-200 мм, крошка 0-10 мм, мука 0-0.2 мм. Доставка по России.',
  keywords: ['каталог мраморной крошки', 'мраморный щебень цена', 'купить щебень', 'фракции щебня'],
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
