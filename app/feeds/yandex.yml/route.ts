import { generateYandexYml } from '@/lib/seo/merchant-feeds'

export const dynamic = 'force-static'

export function GET() {
  return new Response(generateYandexYml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
