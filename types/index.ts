export interface Product {
  id: string
  slug: string
  name: string
  category: 'scherb' | 'kroshka' | 'muika' | 'otsev'
  fraction: string
  pricePerTon: number
  priceRetail?: number
  description: string
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
