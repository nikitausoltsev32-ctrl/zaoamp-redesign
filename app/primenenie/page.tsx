import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { applicationLandingPages } from '@/lib/data/seo-landings'
import { generateBreadcrumbSchema, JsonLd } from '@/lib/seo/schema'

export const metadata: Metadata = {
  title: 'Применение мраморной крошки, щебня, муки и микрокальцита',
  description:
    'Посадочные страницы по применению мраморной продукции: ландшафт, дорожная отсыпка, штукатурки, ЛКМ, пластики и сельское хозяйство.',
  alternates: {
    canonical: '/primenenie/',
  },
}

export default function ApplicationsPage() {
  const pages = Object.values(applicationLandingPages)
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: '/' },
    { name: 'Применение', item: '/primenenie' },
  ])

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="min-h-screen bg-stone-50">
        <section className="bg-white border-b border-stone-200 py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
              Применение
            </Badge>
            <h1 className="max-w-4xl text-3xl font-bold text-stone-950 md:text-5xl">
              Как выбрать мраморную продукцию под задачу
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-600">
              Подборки по сценариям закупки: какие фракции подходят, что указать в заявке,
              как считать объем и на какие документы смотреть.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Card key={page.slug} className="border-stone-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl">{page.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm leading-relaxed text-stone-600">{page.description}</p>
                  <Button asChild variant="outline">
                    <Link href={`/primenenie/${page.slug}`}>
                      Открыть
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
