import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from '@/components/ui/app-link'
import { blogPosts } from '@/lib/data/blog'
import { products } from '@/lib/data/products'
import { getAuthor } from '@/lib/data/authors'
import { generateBlogPostMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema, generateArticleSchema, JsonLd } from '@/lib/seo/schema'

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
  return generateBlogPostMetadata(post)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const relatedProductsList = post.relatedProducts
    ? products.filter((p) => post.relatedProducts!.includes(p.slug))
    : []

  const author = getAuthor(post.authorSlug)

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: '/' },
    { name: 'Блог', item: '/blog' },
    { name: post.title, item: `/blog/${post.slug}` },
  ])

  return (
    <>
      {author && <JsonLd data={generateArticleSchema(post, author)} />}
      <JsonLd data={breadcrumb} />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-stone-50 border-b border-stone-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Главная
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Блог
              </Link>
              <span>/</span>
              <span className="text-foreground truncate">{post.title}</span>
            </nav>
          </div>
        </div>

        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {post.h1}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>

            {/* Author byline */}
            {author && (
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sapphire/10 text-brand-sapphire font-semibold text-sm">
                  {author.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{author.name}</p>
                  <p className="text-xs text-muted-foreground">{author.role}, ЗАО АМП</p>
                </div>
              </div>
            )}
          </header>

          <div className="prose prose-stone prose-lg max-w-none">
            {post.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{section.h2}</h2>
                {section.content && (
                  <p className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>
                )}
                {section.subsections?.map((sub, j) => (
                  <div key={j}>
                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{sub.h3}</h3>
                    <p className="text-muted-foreground leading-relaxed">{sub.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {relatedProductsList.length > 0 && (
            <aside className="mt-12 pt-8 border-t border-stone-200">
              <h2 className="text-xl font-bold text-foreground mb-4">Связанные продукты</h2>
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

          {/* Author box at bottom */}
          {author && (
            <div className="mt-10 p-5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-sapphire/10 text-brand-sapphire font-semibold">
                  {author.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{author.name}</p>
                  <p className="text-sm text-muted-foreground mb-1">{author.role}, ЗАО АМП</p>
                  <p className="text-sm text-muted-foreground">{author.bio}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-stone-200">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Все статьи
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
