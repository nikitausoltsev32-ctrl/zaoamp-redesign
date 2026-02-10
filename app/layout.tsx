import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-merriweather',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Мраморная крошка и щебень | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
    template: '%s | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
  },
  description: 'Производитель белой мраморной крошки и щебня премиум-качества. Доставка по всей России. Цены от 2 900 ₽/тонна.',
  keywords: ['мраморная крошка', 'мраморный щебень', 'белый щебень', 'купить щебень', 'Екатеринбург'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main className="pt-20 md:pt-28">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
