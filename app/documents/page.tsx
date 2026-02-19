import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Download } from 'lucide-react'
import { qualityDocuments } from '@/lib/data/documents'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Паспорта качества | ЗАО АМП',
  description: 'Паспорта качества и сертификаты соответствия на мраморную крошку и щебень.',
}

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-brand-ice-blue">
      <section className="py-20 bg-brand-ice-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Паспорта качества
            </h1>
            <p className="text-lg text-muted-foreground">
              Скачайте паспорта качества на продукцию. Все документы соответствуют ГОСТ.
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

          <p className="mt-8 text-center text-sm text-muted-foreground">
            При отгрузке предоставляются оригиналы сертификатов и паспортов качества.
          </p>

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
