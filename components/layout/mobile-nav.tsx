'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ContactBar } from './contact-bar'
import { navItems } from '@/lib/data/navigation'

import logoAmp from '@/logos/AMP-логотип/амп-1 (2).jpg'

export function MobileNav() {
  const [open, setOpen] = useState(false)

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
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-stone-900 hover:text-brand-sapphire transition-colors py-2 border-b border-stone-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-8 border-t border-stone-100">
          <ContactBar variant="mobile" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
