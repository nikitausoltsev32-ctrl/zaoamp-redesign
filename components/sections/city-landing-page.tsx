import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductCard } from '@/components/product-card'
import type { CityLandingPage } from '@/lib/data/seo-landings'
import { getProductsForLanding } from '@/lib/data/seo-landings'
import { products } from '@/lib/data/products'
import { generateBreadcrumbSchema, generateFAQSchema, JsonLd } from '@/lib/seo/schema'

interface CityLandingPageTemplateProps {
  page: CityLandingPage
}

export function CityLandingPageTemplate({ page }: CityLandingPageTemplateProps) {
  const relatedProducts = getProductsForLanding(products, page.productSlugs)
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: '/' },
    { name: page.city, item: `/${page.slug}` },
  ])

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={generateFAQSchema(page.faqs)} />
      <main className="min-h-screen bg-stone-50">
        <section className="bg-white border-b border-stone-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <nav className="mb-6 flex flex-wrap gap-2 text-sm text-stone-500">
              <Link href="/" className="hover:text-brand-sapphire">Главная</Link>
              <span>/</span>
              <span className="text-stone-900">{page.city}</span>
            </nav>
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                  Доставка в {page.city}
                </Badge>
                <h1 className="max-w-4xl text-3xl font-bold tracking-normal text-stone-950 md:text-5xl">
                  {page.h1}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-600">
                  {page.intro}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild className="bg-brand-sapphire hover:bg-brand-sapphire-dark">
                    <Link href="/contacts">
                      Рассчитать доставку
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="tel:+79193931992">
                      <Phone className="mr-2 h-4 w-4" />
                      Позвонить
                    </a>
                  </Button>
                </div>
              </div>
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 shadow-xl lg:block">
                <Image
                  src={page.heroImage}
                  alt={page.heroImageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 0px, 45vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                  Логистика
                </Badge>
                <h2 className="text-2xl font-bold text-stone-950 md:text-3xl">
                  Как считаем поставку
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-stone-600">
                  {page.deliveryText}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {page.logistics.map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg border border-stone-200 bg-white p-4">
                    <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand-sapphire" />
                    <span className="text-sm font-medium text-stone-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-3xl">
              <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                Что заказывают
              </Badge>
              <h2 className="text-2xl font-bold text-stone-950 md:text-3xl">
                Основные направления для {page.city}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {page.targetProducts.map((item) => (
                <Card key={item.href} className="border-stone-200">
                  <CardHeader>
                    <MapPin className="h-5 w-5 text-brand-sapphire" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-stone-600">{item.text}</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={item.href}>
                        Смотреть
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                    Быстрый выбор
                  </Badge>
                  <h2 className="text-2xl font-bold text-stone-950 md:text-3xl">
                    Популярные позиции
                  </h2>
                </div>
                <Button asChild variant="outline">
                  <Link href="/catalog">Весь каталог</Link>
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} variant="compact" />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-stone-950 md:text-3xl">
              Частые вопросы по доставке
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="rounded-lg border border-stone-200 bg-stone-50 p-5">
                  <summary className="cursor-pointer font-semibold text-stone-950">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-deep-navy py-12 text-white md:py-16">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold md:text-3xl">
              Рассчитать поставку в {page.city}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-300">
              Отправьте фракцию, объем, адрес выгрузки и желаемую упаковку. Вернем КП с материалом и логистикой.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-white text-brand-deep-navy hover:bg-stone-100">
                <Link href="/contacts">Оставить заявку</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="tel:+79193931992">+7 (919) 393-19-92</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
