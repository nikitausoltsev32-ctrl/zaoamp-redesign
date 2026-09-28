import type { Metadata, Viewport } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import { UTMTracker } from '@/components/utm-tracker'
import { CookieConsent } from '@/components/cookie-consent'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { FloatingActions } from '@/components/layout/floating-actions'
import { MotionProvider } from '@/components/motion-provider'
import { AiAssistantWidgetLazy } from '@/components/ai/ai-assistant-widget-lazy'
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
  preload: false,
  display: 'swap',
})

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-J982LCR0MP" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-J982LCR0MP');`,
          }}
        />
        <link rel="preconnect" href="https://mc.yandex.ru" />
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
          <AiAssistantWidgetLazy />
        </MotionProvider>
        <CookieConsent />
      </body>
    </html>
  )
}
