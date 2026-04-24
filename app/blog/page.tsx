import type { Metadata } from 'next'
import { BlogCard } from '@/components/sections/blog-card'
import { blogPosts } from '@/lib/data/blog'

export const metadata: Metadata = {
  title: 'Блог — мрамор в строительстве и ландшафте | АМП',
  description:
    'Статьи о применении мраморного щебня, крошки и микрокальцита: выбор фракции, технические характеристики, ландшафтный дизайн, промышленные применения.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Блог — мрамор в строительстве и ландшафте | АМП',
    description:
      'Статьи о применении мраморного щебня, крошки и микрокальцита: выбор фракции, технические характеристики, ландшафтный дизайн, промышленные применения.',
    url: '/blog',
  },
}

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="bg-white border-b border-stone-200 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Блог</h1>
          <p className="text-lg text-stone-500 max-w-2xl">
            Технические статьи и практические советы по применению мраморных материалов в
            строительстве, ландшафте и промышленности.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}
