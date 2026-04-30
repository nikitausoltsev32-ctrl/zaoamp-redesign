import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { qualityDocuments } from '@/lib/data/documents'
import { generateDocumentsMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema, JsonLd } from '@/lib/seo/schema'

export const metadata: Metadata = generateDocumentsMetadata(qualityDocuments.length)

export default function DocumentsPage() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Главная', item: '/' },
    { name: 'Паспорта качества', item: '/documents' },
  ])

  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="min-h-screen bg-brand-ice-blue">
        <section className="py-20 bg-brand-ice-blue">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Паспорта качества</h1>
              <p className="text-lg text-muted-foreground">
                Скачайте доступные паспорта качества на продукцию. По остальным позициям комплект
                документов уточняйте у менеджера при запросе.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {qualityDocuments.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 bg-brand-ice-blue rounded-xl shadow-sm hover:shadow-md transition-shadow border border-stone-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-sapphire/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-brand-sapphire" />
                    </div>
                    <span className="font-medium text-gray-900">{doc.name}</span>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground shrink-0" />
                </a>
              ))}
            </div>

            {/* TODO: добавить паспорта качества для остальных SKU, когда появятся подтверждённые PDF. */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              На сайте опубликованы подтверждённые файлы для части позиций. По запросу подскажем,
              какие документы доступны для вашей номенклатуры.
            </p>

            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link href="/catalog">Перейти в каталог</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
