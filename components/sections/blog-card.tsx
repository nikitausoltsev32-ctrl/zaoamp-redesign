import Link from 'next/link'
import { BlogPost } from '@/lib/data/blog'

const categoryLabels: Record<BlogPost['category'], string> = {
  kroshka: 'Мраморная крошка',
  shcheben: 'Мраморный щебень',
  muka: 'Мука и микрокальцит',
  obshchee: 'Общее',
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-brand-sapphire/40 hover:shadow-md transition-all duration-200">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-powder-blue/20 text-brand-sapphire">
            {categoryLabels[post.category]}
          </span>
          <span className="text-xs text-stone-400">{post.readTime} мин чтения</span>
        </div>
        <h2 className="text-lg font-semibold text-stone-900 group-hover:text-brand-sapphire transition-colors mb-2 line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-sm text-stone-500 line-clamp-3 flex-1">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <time className="text-xs text-stone-400" dateTime={post.publishDate}>
            {new Date(post.publishDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-brand-sapphire hover:text-brand-deep-navy transition-colors"
          >
            Читать →
          </Link>
        </div>
      </div>
    </article>
  )
}
