import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: 'https://amp-minerals.ru',
    sitemap: 'https://amp-minerals.ru/sitemap.xml',
  }
}
