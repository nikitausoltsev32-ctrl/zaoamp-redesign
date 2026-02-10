'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { ContactBar } from './contact-bar'
import { MobileNav } from './mobile-nav'
import { navItems } from '@/lib/data/navigation'

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
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Logo size="xl" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-stone-700 hover:text-brand-orange transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Contact & Mobile Menu */}
          <div className="flex items-center gap-2">
            <ContactBar variant="header" />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
