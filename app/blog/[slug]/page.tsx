import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { blogPosts } from '@/lib/data/blog'
import { products } from '@/lib/data/products'
import { generateBreadcrumbSchema, JsonLd } from '@/lib/seo/schema'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishDate,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const relatedProductsList = post.relatedProducts
    ? products.filter((p) => post.relatedProducts!.includes(p.slug))
    : []

  const articleUrl = `https://amp-minerals.ru/blog/${post.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.h1,
    description: post.excerpt,
    url: articleUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: { '@type': 'Organization', name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ', url: 'https://amp-minerals.ru' },
    publisher: {
      '@type': 'Organization',
      name: 'ЗАО АМП ИМПОРТ-ЭКСПОРТ',
      url: 'https://amp-minerals.ru',
      logo: { '@type': 'ImageObject', url: 'https://amp-minerals.ru/logo.png' },
    },
  }

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: '/' },
    { name: 'Блог', item: '/blog' },
    { name: post.title, item: `/blog/${post.slug}` },
  ])

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumb} />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-stone-50 border-b border-stone-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-stone-500">
              <Link href="/" className="hover:text-stone-800 transition-colors">
                Главная
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-stone-800 transition-colors">
                Блог
              </Link>
              <span>/</span>
              <span className="text-stone-800 truncate">{post.title}</span>
            </nav>
          </div>
        </div>

        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-sm text-stone-500">
              <time dateTime={post.publishDate}>
                {new Date(post.publishDate).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{post.readTime} мин чтения</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-4">
              {post.h1}
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed">{post.excerpt}</p>
          </header>

          <div className="prose prose-stone prose-lg max-w-none">
            {post.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-2xl font-bold text-stone-900 mt-10 mb-4">{section.h2}</h2>
                {section.content && (
                  <p className="text-stone-600 leading-relaxed mb-4">{section.content}</p>
                )}
                {section.subsections?.map((sub, j) => (
                  <div key={j}>
                    <h3 className="text-xl font-semibold text-stone-800 mt-6 mb-3">{sub.h3}</h3>
                    <p className="text-stone-600 leading-relaxed">{sub.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {relatedProductsList.length > 0 && (
            <aside className="mt-12 pt-8 border-t border-stone-200">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Связанные продукты</h2>
              <ul className="space-y-2">
                {relatedProductsList.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-brand-sapphire hover:text-brand-deep-navy transition-colors font-medium"
                    >
                      {product.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className="mt-8 pt-6 border-t border-stone-200">
            <Link
              href="/blog"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              ← Все статьи
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
