import type { Metadata, Viewport } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import { UTMTracker } from '@/components/utm-tracker'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { FloatingActions } from '@/components/layout/floating-actions'
import { MotionProvider } from '@/components/motion-provider'
// Аналитика (Яндекс.Метрика, Vercel) и cookie-баннер временно отключены.
// Вернём корректно — с согласием через CookieConsent — после переезда на
// российский VPS (152-ФЗ, хранение данных на территории РФ).
// AI-чат также скрыт; компоненты сохранены в коде.
// import { CookieConsent } from '@/components/cookie-consent'
// import { AiAssistantWidget } from '@/components/ai/ai-assistant-widget'
import { defaultMetadata } from '@/lib/seo/metadata'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/schema'

const inter = Inter({
  subsets: ['cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['cyrillic'],
  variable: '--font-merriweather',
  display: 'swap',
})

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()

  return (
    <html lang="ru" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        {/* Security: Escaping '<' to prevent XSS vulnerability when rendering JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-brand-ice-blue">
        <UTMTracker />
        <MotionProvider>
          <Header />
          <main className="pt-20 md:pt-28 bg-brand-ice-blue">
            {children}
          </main>
          <Footer />
          <FloatingActions />
        </MotionProvider>
      </body>
    </html>
  )
}
