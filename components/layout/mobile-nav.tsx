'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ContactBar } from './contact-bar'
import { navItems } from '@/lib/data/navigation'

import logoAmp from '@/logos/AMP-логотип/амп-1 (2).jpg'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const toggle = (href: string) =>
    setExpandedItem((prev) => (prev === href ? null : href))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="relative">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-brand-ice-blue">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <Image
                src={logoAmp}
                alt="АМП ИМПОРТ-ЭКСПОРТ"
                className="w-auto object-contain h-14 mix-blend-multiply"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col mt-8">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.href} className="border-b border-stone-100">
                <button
                  onClick={() => toggle(item.href)}
                  className="w-full flex items-center justify-between text-lg font-medium text-stone-900 hover:text-brand-sapphire transition-colors py-3"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedItem === item.href ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedItem === item.href && (
                  <div className="flex flex-col pl-4 pb-2 gap-1">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-sm text-stone-500 hover:text-brand-sapphire py-1.5 transition-colors"
                    >
                      Весь каталог
                    </Link>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium text-stone-700 hover:text-brand-sapphire py-1.5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-stone-900 hover:text-brand-sapphire transition-colors py-3 border-b border-stone-100"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="mt-8 pt-8 border-t border-stone-100">
          <ContactBar variant="mobile" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
