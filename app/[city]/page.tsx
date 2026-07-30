import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CityLandingPageTemplate } from '@/components/sections/city-landing-page'
import { cityLandingPages, getCityLandingPage } from '@/lib/data/seo-landings'
import { keywordsForTarget } from '@/lib/data/semantic-core'

interface CityPageProps {
  params: {
    city: string
  }
}

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(cityLandingPages).map((city) => ({ city }))
}

export function generateMetadata({ params }: CityPageProps): Metadata {
  const page = getCityLandingPage(params.city)

  if (!page) {
    return {}
  }

  return {
    title: page.title,
    description: page.description,
    keywords: keywordsForTarget(`/${page.slug}`),
    alternates: {
      canonical: `/${page.slug}/`,
    },
    openGraph: {
      type: 'website',
      title: page.title,
      description: page.description,
      url: `/${page.slug}/`,
      ...(page.heroImage
        ? {
            images: [
              {
                url: page.heroImage,
                alt: page.heroImageAlt,
              },
            ],
          }
        : {}),
    },
  }
}

export default function CityPage({ params }: CityPageProps) {
  const page = getCityLandingPage(params.city)

  if (!page) {
    notFound()
  }

  return <CityLandingPageTemplate page={page} />
}
