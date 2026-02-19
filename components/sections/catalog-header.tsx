import Link from 'next/link'
import { ChevronRight, Package } from 'lucide-react'

export function CatalogHeader() {
  return (
    <div className="border-b bg-brand-ice-blue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Каталог</span>
        </nav>

        {/* Title and description */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Каталог продукции
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Мраморная крошка и щебень всех фракций от прямого производителя. 
              Высокое качество, доставка по России.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-brand-sapphire">
                <Package className="h-5 w-5" />
                <span className="text-2xl font-bold">6</span>
              </div>
              <p className="text-sm text-muted-foreground">видов продукции</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-sapphire">2 900 ₽</div>
              <p className="text-sm text-muted-foreground">от за тонну</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
