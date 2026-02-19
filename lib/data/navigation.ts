import { NavItem, ContactInfo } from '@/types'

export const navItems: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'Паспорта качества', href: '/documents' },
  { label: 'О компании', href: '/about' },
  { label: 'Доставка', href: '/delivery' },
  { label: 'Контакты', href: '/contacts' },
]

export const productLinks: NavItem[] = [
  { label: 'Щебень 50-200 мм', href: '/product/mramornyj-shheben-50-200' },
  { label: 'Щебень 20-50 мм', href: '/product/mramornyj-shheben-20-50' },
  { label: 'Щебень 10-20 мм', href: '/product/mramornyj-shheben-10-20' },
  { label: 'Крошка 5-10 мм', href: '/product/mramornaya-kroshka-5-10' },
  { label: 'Крошка 0-5 мм', href: '/product/mramornaya-kroshka-0-5' },
  { label: 'Мука 0-0.2 мм', href: '/product/mramornaya-muka-0-0-2' },
]
