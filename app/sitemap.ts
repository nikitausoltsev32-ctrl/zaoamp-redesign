import { MetadataRoute } from 'next'
import { products } from '@/lib/data/products'
import { categories } from '@/lib/data/categories'
import { blogPosts } from '@/lib/data/blog'
import { applicationLandingPages, cityLandingPages } from '@/lib/data/seo-landings'

const BASE_URL = 'https://amp-minerals.ru'

function pageUrl(path = '/') {
  if (path === '/') return `${BASE_URL}/`
  return `${BASE_URL}${path}/`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: pageUrl('/'),
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
      lastModified: new Date('2025-10-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: pageUrl('/delivery'),
      lastModified: new Date('2025-10-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: pageUrl('/contacts'),
      lastModified: new Date('2025-10-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: pageUrl('/documents'),
      lastModified: new Date('2025-10-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: pageUrl('/privacy'),
      lastModified: new Date('2026-07-04'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: pageUrl('/blog'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: pageUrl('/primenenie'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
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
    lastModified: new Date('2025-10-01'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: pageUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  const applicationPages: MetadataRoute.Sitemap = Object.values(applicationLandingPages).map((page) => ({
    url: pageUrl(`/primenenie/${page.slug}`),
    lastModified: new Date('2025-10-01'),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  const cityPages: MetadataRoute.Sitemap = Object.values(cityLandingPages).map((page) => ({
    url: pageUrl(`/${page.slug}`),
    lastModified: new Date('2025-10-01'),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages, ...applicationPages, ...cityPages]
}
