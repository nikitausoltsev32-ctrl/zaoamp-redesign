import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Googlebot',
          'bingbot',
        ],
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    host: 'https://amp-minerals.ru',
    sitemap: 'https://amp-minerals.ru/sitemap.xml',
  }
}
