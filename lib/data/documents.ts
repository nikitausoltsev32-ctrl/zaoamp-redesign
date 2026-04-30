/** Паспорта качества и сертификаты. Положите PDF в public/documents/ */

export interface QualityDocument {
  id: string
  name: string
  description?: string
  href: string
  productSlug?: string
}

export const qualityDocuments: QualityDocument[] = [
  { id: 'pasport-0-0-2', name: 'Паспорт качества 0–0,2 мм', href: '/documents/pasport-0-0-2.pdf', productSlug: 'mramornaya-muka-0-0-2' },
  { id: 'pasport-0-2-0-5', name: 'Паспорт качества 0,2–0,5 мм', href: '/documents/pasport-0-2-0-5.pdf', productSlug: 'mramornaya-kroshka-0-5' },
  { id: 'pasport-0-5-1-0', name: 'Паспорт качества 0,5–1,0 мм', href: '/documents/pasport-0-5-1-0.pdf', productSlug: 'mramornaya-kroshka-0-5-1-0' },
  { id: 'pasport-1-0-1-5', name: 'Паспорт качества 1,0–1,5 мм', href: '/documents/pasport-1-0-1-5.pdf' },
  { id: 'pasport-1-5-2-0', name: 'Паспорт качества 1,5–2,0 мм', href: '/documents/pasport-1-5-2-0.pdf' },
  { id: 'pasport-2-0-3-0', name: 'Паспорт качества 2,0–3,0 мм', href: '/documents/pasport-2-0-3-0.pdf' },
]

// TODO: добавить подтверждённые PDF для остальных SKU, когда они будут доступны в проекте.

export function getDocumentByProductSlug(slug: string): QualityDocument | undefined {
  return qualityDocuments.find((d) => d.productSlug === slug)
}
