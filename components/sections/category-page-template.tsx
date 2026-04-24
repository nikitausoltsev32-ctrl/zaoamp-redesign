'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CatalogGrid } from '@/components/sections/catalog-grid'
import { CategoryData, getCategoryProducts } from '@/lib/data/categories'
import { blogPosts } from '@/lib/data/blog'
import { JsonLd, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schema'

interface Props {
  data: CategoryData
}

export function CategoryPageTemplate({ data }: Props) {
  const products = getCategoryProducts(data.slug)
  const relatedPosts = blogPosts.filter((p) => data.relatedBlogSlugs.includes(p.slug))
  const minPrice = products
    .map((p) => p.pricePerTon)
    .filter((v): v is number => typeof v === 'number')
    .sort((a, b) => a - b)[0]

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: 'https://amp-minerals.ru' },
    { name: 'Каталог', item: 'https://amp-minerals.ru/catalog' },
    { name: data.breadcrumbLabel, item: `https://amp-minerals.ru/catalog/${data.slug}` },
  ])

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={generateFAQSchema(data.faqs)} />
      <div className="min-h-screen bg-brand-ice-blue">
        {/* Hero */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-stone-50 to-stone-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-muted-foreground mb-6 flex gap-2 flex-wrap">
              <Link href="/" className="hover:text-brand-sapphire">Главная</Link>
              <span>/</span>
              <Link href="/catalog" className="hover:text-brand-sapphire">Каталог</Link>
              <span>/</span>
              <span className="text-gray-900">{data.breadcrumbLabel}</span>
            </nav>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="max-w-3xl">
                <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                  Каталог · {data.breadcrumbLabel}
                </Badge>
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
                  {data.h1}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {data.intro}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-brand-sapphire hover:bg-brand-sapphire-dark">
                    <Link href="/contacts">
                      Запросить цену
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {typeof minPrice === 'number' && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border text-sm">
                      <span className="text-muted-foreground">от</span>
                      <span className="font-semibold text-gray-900">
                        {minPrice.toLocaleString('ru-RU')} ₽/т
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl hidden lg:block"
              >
                <Image
                  src={data.heroImage}
                  alt={data.heroImageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 0px, 50vw"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Lead / key points */}
        <section className="py-16 bg-brand-ice-blue">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  О материале
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {data.leadText}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.keyPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white p-5 rounded-xl shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 text-brand-sapphire mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{point.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {point.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="bg-stone-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
            <div className="text-center mb-2">
              <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                Фракции в наличии
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Каталог фракций
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Все фракции этой категории — с ценами, техническими характеристиками и упаковкой
              </p>
            </div>
          </div>
          <CatalogGrid products={products} />
        </section>

        {/* Applications */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                Применения
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Где применяется
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {data.applications.map((app, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="p-6 rounded-xl border border-stone-200 bg-stone-50 hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-sapphire/10 text-brand-sapphire mb-4">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{app.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {app.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-brand-ice-blue">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
                  FAQ
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Частые вопросы
                </h2>
              </div>
              <div className="space-y-4">
                {data.faqs.map((faq, i) => (
                  <motion.details
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group bg-white rounded-xl p-5 cursor-pointer open:shadow-sm"
                  >
                    <summary className="font-semibold text-gray-900 list-none flex justify-between items-center gap-4">
                      <span>{faq.question}</span>
                      <ArrowRight className="h-4 w-4 text-brand-sapphire transition-transform group-open:rotate-90 shrink-0" />
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related blog posts */}
        {relatedPosts.length > 0 && (
          <section className="py-14 bg-stone-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Полезные статьи</h2>
              <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white rounded-xl border border-stone-200 p-5 hover:border-brand-sapphire/40 hover:shadow-sm transition-all"
                  >
                    <span className="text-xs text-brand-sapphire font-medium mb-2">
                      {post.readTime} мин чтения
                    </span>
                    <span className="font-semibold text-stone-900 group-hover:text-brand-sapphire transition-colors text-sm leading-snug">
                      {post.title}
                    </span>
                    <span className="mt-2 text-xs text-stone-500 line-clamp-2">{post.excerpt}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-brand-deep-navy text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Нужна консультация по фракции?
            </h2>
            <p className="text-stone-300 mb-8 max-w-2xl mx-auto">
              Подскажем, какая фракция подойдёт под вашу задачу, рассчитаем объём и стоимость доставки
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-brand-deep-navy hover:bg-stone-100">
                <Link href="/contacts">Написать нам</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="tel:+79193931992">+7 (919) 393-19-92</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
