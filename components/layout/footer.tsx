import Link from 'next/link'
import { Logo } from './logo'
import { ContactBar } from './contact-bar'
import { navItems, productLinks, categoryLinks } from '@/lib/data/navigation'
import { applicationLinks, cityLinks } from '@/lib/data/seo-landings'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-deep-navy text-stone-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Logo size="xxl" variant="dark" className="mb-4" />
            <p className="text-stone-400 text-sm mb-4">
              Производитель белой мраморной крошки и щебня премиум-качества.
              Собственное месторождение на Урале. Доставка по всей России.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4">Навигация</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="font-semibold text-white mb-4">Блог</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-stone-400 hover:text-white transition-colors text-sm">
                  Все статьи
                </Link>
              </li>
              <li>
                <Link href="/blog/kak-vybrat-frakciyu-mramornoj-kroshki" className="text-stone-400 hover:text-white transition-colors text-sm">
                  Выбор фракции крошки
                </Link>
              </li>
              <li>
                <Link href="/blog/mramornyj-shcheben-vs-granitnyj" className="text-stone-400 hover:text-white transition-colors text-sm">
                  Мрамор vs гранит
                </Link>
              </li>
              <li>
                <Link href="/blog/radiacionnaya-bezopasnost-shchebnya-klass-1" className="text-stone-400 hover:text-white transition-colors text-sm">
                  Радиационная безопасность
                </Link>
              </li>
              <li>
                <Link href="/blog/belizna-mikrokalsita-98-procentov" className="text-stone-400 hover:text-white transition-colors text-sm">
                  Белизна микрокальцита 98%
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Каталог</h3>
            <ul className="space-y-2">
              {categoryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/catalog"
                  className="text-brand-powder-blue hover:text-brand-ice-blue transition-colors text-sm"
                >
                  Все фракции →
                </Link>
              </li>
            </ul>
          </div>

          {/* All Products */}
          <div>
            <h3 className="font-semibold text-white mb-4">Продукция</h3>
            <ul className="space-y-2">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Контакты</h3>
            <ContactBar variant="footer" />
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-white mb-4">Применение</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {applicationLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">География поставок</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {cityLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © {currentYear} ЗАО &quot;АМП ИМПОРТ-ЭКСПОРТ&quot;. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-stone-500 hover:text-stone-300 transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
