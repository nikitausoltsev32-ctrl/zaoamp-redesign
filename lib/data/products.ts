import { Product } from '@/types'

export const products: Product[] = [
  {
    id: '1',
    slug: 'mramornyj-shheben-50-200',
    name: 'Мраморный щебень 50-200 мм',
    category: 'scherb',
    fraction: '50-200 мм',
    pricePerTon: 2900,
    description: 'Крупная фракция мраморного щебня для дренажа, ландшафтного дизайна и декоративных работ.',
    applications: [
      'Дренажные системы',
      'Ландшафтный дизайн',
      'Декоративное оформление',
      'Засыпка траншей'
    ],
    specifications: {
      whiteness: '95-98%',
      packaging: ['Навалом', 'Биг-бэги 1т', 'Биг-бэги 500кг'],
      caco3: '≥ 98%',
      radioactivity: 'Класс 1 (безопасный)'
    },
    image: '/images/products/shheben-20-50.jpg',
    seo: {
      title: 'Мраморный щебень 50-200 мм купить в Екатеринбурге | Цена 2 900 ₽/т',
      description: 'Мраморный щебень фракции 50-200 мм от производителя. Белизна 98%. Доставка по Уралу и России.',
      keywords: ['щебень 50-200', 'мраморный щебень крупный', 'купить щебень екатеринбург']
    }
  },
  {
    id: '2',
    slug: 'mramornyj-shheben-20-50',
    name: 'Мраморный щебень 20-50 мм',
    category: 'scherb',
    fraction: '20-50 мм',
    pricePerTon: 3100,
    description: 'Универсальная фракция для строительства, дорожных работ и производства бетона.',
    applications: [
      'Бетонные смеси',
      'Строительство дорог',
      'Фундаментные работы',
      'Железобетонные изделия'
    ],
    specifications: {
      whiteness: '96-98%',
      packaging: ['Навалом', 'Биг-бэги 1т', 'Биг-бэги 500кг'],
      caco3: '≥ 98%',
      radioactivity: 'Класс 1 (безопасный)'
    },
    image: '/images/products/shheben-20-50.jpg',
    seo: {
      title: 'Мраморный щебень 20-50 мм купить | Цена 3 100 ₽/т | Доставка',
      description: 'Щебень мраморный 20-50 мм для строительства. Высокая белизна 98%. Производитель ЗАО АМП.',
      keywords: ['щебень 20-50', 'мраморный щебень', 'строительный щебень']
    }
  },
  {
    id: '3',
    slug: 'mramornyj-shheben-10-20',
    name: 'Мраморный щебень 10-20 мм',
    category: 'scherb',
    fraction: '10-20 мм',
    pricePerTon: 3300,
    description: 'Оптимальная фракция для бетонных работ и производства высококачественных смесей.',
    applications: [
      'Бетон М200-М500',
      'Производство плитки',
      'ЖБИ',
      'Строительные растворы'
    ],
    specifications: {
      whiteness: '97-98%',
      packaging: ['Навалом', 'Биг-бэги 1т', 'Биг-бэги 500кг'],
      caco3: '≥ 98%',
      radioactivity: 'Класс 1 (безопасный)'
    },
    image: '/images/products/shheben-10-20.jpg',
    seo: {
      title: 'Мраморный щебень 10-20 мм купить | Цена 3 300 ₽/т от производителя',
      description: 'Щебень 10-20 мм из белого мрамора. Для бетона и ЖБИ. Доставка по России.',
      keywords: ['щебень 10-20', 'мраморный щебень бетон', 'щебень для жби']
    }
  },
  {
    id: '4',
    slug: 'mramornaya-kroshka-5-10',
    name: 'Мраморная крошка 5-10 мм',
    category: 'kroshka',
    fraction: '5-10 мм',
    pricePerTon: 3500,
    description: 'Популярная фракция для ландшафтного дизайна, отмосток и декоративных покрытий.',
    applications: [
      'Ландшафтный дизайн',
      'Отмостки и дорожки',
      'Декоративные покрытия',
      'Аквариумы и террариумы'
    ],
    specifications: {
      whiteness: '97-98%',
      packaging: ['Биг-бэги 1т', 'Биг-бэги 500кг', 'Мешки 50кг'],
      caco3: '≥ 98%',
      radioactivity: 'Класс 1 (безопасный)'
    },
    image: '/images/products/kroshka-5-10.jpg',
    seo: {
      title: 'Мраморная крошка 5-10 мм купить | Цена 3 500 ₽/т | Доставка',
      description: 'Мраморная крошка 5-10 мм для ландшафта и декора. Белизна 98%. Производитель.',
      keywords: ['мраморная крошка', 'крошка 5-10', 'декоративная крошка']
    }
  },
  {
    id: '5',
    slug: 'mramornaya-kroshka-0-5',
    name: 'Мраморная крошка 0-5 мм',
    category: 'kroshka',
    fraction: '0-5 мм',
    pricePerTon: 3200,
    description: 'Мелкая фракция для производства мраморной штукатурки, шпаклевок и сухих смесей.',
    applications: [
      'Мраморная штукатурка',
      'Шпаклевки',
      'Сухие строительные смеси',
      'Производство плитки'
    ],
    specifications: {
      whiteness: '96-98%',
      packaging: ['Биг-бэги 1т', 'Биг-бэги 500кг', 'Мешки 50кг', 'Мешки 25кг'],
      caco3: '≥ 98%',
      radioactivity: 'Класс 1 (безопасный)'
    },
    image: '/images/products/kroshka-0-5.jpg',
    seo: {
      title: 'Мраморная крошка 0-5 мм купить | Цена 3 200 ₽/т от производителя',
      description: 'Мраморная крошка 0-5 мм для штукатурки и смесей. Доставка по России.',
      keywords: ['мраморная крошка 0-5', 'крошка для штукатурки', 'мраморный песок']
    }
  },
  {
    id: '6',
    slug: 'mramornaya-muka-0-0-2',
    name: 'Мраморная мука 0-0.2 мм',
    category: 'muika',
    fraction: '0-0.2 мм',
    pricePerTon: 4200,
    description: 'Сверхтонкий помол для сельского хозяйства, пищевой промышленности и химии.',
    applications: [
      'Сельское хозяйство (известкование)',
      'Пищевая промышленность',
      'Химическая промышленность',
      'Корм для животных и птицы'
    ],
    specifications: {
      whiteness: '98%',
      packaging: ['Биг-бэги 500кг', 'Мешки 50кг', 'Мешки 25кг'],
      caco3: '≥ 99%',
      radioactivity: 'Класс 1 (безопасный)'
    },
    image: '/images/products/muka-0-0-2.jpg',
    seo: {
      title: 'Мраморная мука 0-0.2 мм купить | Цена 4 200 ₽/т | Доставка',
      description: 'Мраморная мука премиум-класса для сельского хозяйства. CaCO₃ ≥ 99%.',
      keywords: ['мраморная мука', 'мука 0-0.2', 'карбонат кальция']
    }
  }
]

export const featuredProducts = products.slice(0, 4)

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(p => p.category === category)
}
