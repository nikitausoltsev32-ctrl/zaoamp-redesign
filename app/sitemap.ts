import { MetadataRoute } from 'next'
import { products } from '@/lib/data/products'
import { categories } from '@/lib/data/categories'
import { blogPosts } from '@/lib/data/blog'

const BASE_URL = 'https://amp-minerals.ru'

function pageUrl(path = '') {
  return path ? `${BASE_URL}${path}/` : BASE_URL
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: pageUrl('/catalog'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: pageUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: pageUrl('/delivery'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: pageUrl('/contacts'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: pageUrl('/documents'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: pageUrl('/blog'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = Object.values(categories).map((c) => ({
    url: pageUrl(`/catalog/${c.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: pageUrl(`/product/${product.slug}`),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: pageUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages]
}
