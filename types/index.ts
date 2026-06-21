export interface SeoContentSection {
  heading: string
  paragraphs?: string[]
  items?: { label: string; text: string }[]
}

export interface SeoSpecTable {
  caption?: string
  rows: { label: string; value: string }[]
}

export interface SeoLongContent {
  lead?: string[]
  sections?: SeoContentSection[]
  specs?: SeoSpecTable
  outro?: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  category: 'scherb' | 'kroshka' | 'muika' | 'otsev'
  fraction: string
  pricePerTon?: number
  priceRetail?: number
  availability?: 'in_stock' | 'preorder' | 'out_of_stock'
  description: string
  h1?: string
  metaTitle?: string
  metaDescription?: string
  seoContent?: SeoLongContent
  faqs?: { question: string; answer: string }[]
  applications: string[]
  specifications: {
    whiteness: string
    density?: string
    packaging: string[]
    frostResistance?: string
    waterAbsorption?: string
    caco3?: string
    radioactivity?: string
  }
  image?: string
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface CalculatorInput {
  productId: string
  volume: number
  packaging: 'bulk' | 'bigbag' | 'bag50' | 'bag25'
  region: 'ekaterinburg' | 'ural' | 'moscow' | 'railway'
}

export interface CalculatorResult {
  productCost: number
  packagingCost: number
  deliveryCost: number
  discount: number
  total: number
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
  telegram: string
  whatsapp: string
  workingHours: string
}

export interface Benefit {
  icon: string
  title: string
  description: string
}
