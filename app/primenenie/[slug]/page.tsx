import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ApplicationLandingPageTemplate } from '@/components/sections/application-landing-page'
import { applicationLandingPages, getApplicationLandingPage } from '@/lib/data/seo-landings'
import { keywordsForTarget } from '@/lib/data/semantic-core'

interface ApplicationPageProps {
  params: {
    slug: string
  }
}

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(applicationLandingPages).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: ApplicationPageProps): Metadata {
  const page = getApplicationLandingPage(params.slug)

  if (!page) {
    return {}
  }

  return {
    title: page.title,
    description: page.description,
    keywords: keywordsForTarget(`/primenenie/${page.slug}`),
    alternates: {
      canonical: `/primenenie/${page.slug}/`,
    },
    openGraph: {
      type: 'website',
      title: page.title,
      description: page.description,
      url: `/primenenie/${page.slug}/`,
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

export default function ApplicationPage({ params }: ApplicationPageProps) {
  const page = getApplicationLandingPage(params.slug)

  if (!page) {
    notFound()
  }

  return <ApplicationLandingPageTemplate page={page} />
}
