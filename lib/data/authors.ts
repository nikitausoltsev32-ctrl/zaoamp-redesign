export interface Author {
  slug: string
  name: string
  role: string
  bio: string
  image?: string
}

export const authors: Record<string, Author> = {
  'artem-dolgikh': {
    slug: 'artem-dolgikh',
    name: 'Артём Долгих',
    role: 'Технолог',
    bio: 'Технолог производства мраморных материалов. Контроль качества продукции, подбор фракций и консультирование по применению.',
  },
}

export function getAuthor(slug: string): Author | undefined {
  return authors[slug]
}
