/** Паспорта качества и сертификаты. Положите PDF в public/documents/ */

export interface QualityDocument {
  id: string
  name: string
  description?: string
  href: string
  productSlug?: string
}

export const qualityDocuments: QualityDocument[] = [
  { id: 'muka-0-0-2', name: 'Мука 0-0.2 мм', href: '/documents/pasport-muka-0-0-2.pdf', productSlug: 'mramornaya-muka-0-0-2' },
  { id: 'kroshka-0-5', name: 'Крошка 0-5 мм', href: '/documents/pasport-kroshka-0-5.pdf', productSlug: 'mramornaya-kroshka-0-5' },
  { id: 'kroshka-5-10', name: 'Крошка 5-10 мм', href: '/documents/pasport-kroshka-5-10.pdf', productSlug: 'mramornaya-kroshka-5-10' },
  { id: 'shheben-10-20', name: 'Щебень 10-20 мм', href: '/documents/pasport-shheben-10-20.pdf', productSlug: 'mramornyj-shheben-10-20' },
  { id: 'shheben-20-50', name: 'Щебень 20-50 мм', href: '/documents/pasport-shheben-20-50.pdf', productSlug: 'mramornyj-shheben-20-50' },
  { id: 'shheben-50-200', name: 'Щебень 50-200 мм', href: '/documents/pasport-shheben-50-200.pdf', productSlug: 'mramornyj-shheben-50-200' },
]

export function getDocumentByProductSlug(slug: string): QualityDocument | undefined {
  return qualityDocuments.find((d) => d.productSlug === slug)
}
