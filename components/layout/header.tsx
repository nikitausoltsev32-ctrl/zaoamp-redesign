'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { ContactBar } from './contact-bar'
import { MobileNav } from './mobile-nav'
import { navItems } from '@/lib/data/navigation'
import { contactInfo } from '@/lib/data/contacts'
import { ymGoal } from '@/lib/analytics'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-brand-ice-blue/95 backdrop-blur-md shadow-md'
          : 'bg-brand-ice-blue'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Logo size="xl" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-brand-sapphire transition-colors"
                    onClick={() => item.href === '/catalog' && ymGoal('catalog_click')}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="absolute top-full left-0 pt-2 hidden group-hover:block">
                    <div className="bg-white rounded-xl shadow-lg border border-stone-100 py-2 min-w-[220px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-stone-700 hover:text-brand-sapphire hover:bg-stone-50 transition-colors"
                          onClick={() => ymGoal('catalog_category_click')}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-stone-700 hover:text-brand-sapphire transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Phone (mobile) + ContactBar (desktop) + Mobile Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`tel:${contactInfo.whatsapp}`}
              className="lg:hidden text-sm font-semibold text-stone-700 hover:text-brand-sapphire transition-colors whitespace-nowrap"
              onClick={() => ymGoal('phone_click')}
            >
              {contactInfo.phone}
            </a>
            <ContactBar variant="header" />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
