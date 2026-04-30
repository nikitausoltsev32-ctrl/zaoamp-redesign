'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { m } from 'framer-motion'
import { ArrowRight, Calculator, Phone } from 'lucide-react'
import { HeroBackgroundSlider } from '@/components/hero-background-slider'

export function HeroSection() {
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = phone.trim()
    if (!val) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: val, source: 'hero' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Ошибка отправки')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <HeroBackgroundSlider />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-8">
        <div className="max-w-3xl">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <Badge className="w-fit bg-brand-sapphire text-white hover:bg-brand-sapphire-dark border-0 text-sm px-4 py-1">
              Собственное производство на Урале
            </Badge>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              Мраморная крошка и щебень{' '}
              <span className="text-brand-powder-blue">премиум-качества</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">
              Белизна 98%. Доставка по всей России.{' '}
              <span className="font-bold text-white">От 2 000 ₽/тонна</span>.
              Собственное месторождение белого мрамора.
            </p>

            {/* Inline КП форма */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 max-w-md border border-white/20">
              {submitted ? (
                <p className="text-white font-medium py-2">
                  Спасибо! Перезвоним в ближайшее время.
                </p>
              ) : (
                <>
                  <p className="text-white font-semibold mb-3 text-base">
                    Получить коммерческое предложение
                  </p>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-white text-gray-900 placeholder:text-gray-400 border-0 flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-brand-sapphire hover:bg-brand-sapphire-dark text-white border-0 shrink-0"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {loading ? '...' : 'Перезвоним'}
                    </Button>
                  </form>
                  {error && (
                    <p className="text-red-300 text-sm mt-2">{error}</p>
                  )}
                  <p className="text-white/50 text-xs mt-2">
                    Предварительный расчёт в день обращения. Точная цена зависит от объёма, упаковки и доставки.
                  </p>
                </>
              )}
            </div>
          </m.div>
        </div>

        {/* Вторичные кнопки */}
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-brand-sapphire hover:bg-brand-sapphire-dark text-white border-0 px-8"
          >
            <Link href="/catalog">
              Каталог продукции
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white"
          >
            <Link href="/#calculator">
              <Calculator className="mr-2 h-4 w-4" />
              Рассчитать стоимость
            </Link>
          </Button>
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-brand-sapphire flex items-center justify-center text-white font-bold text-lg">
              98%
            </div>
            <div className="text-white min-w-0">
              <p className="font-semibold">Белизна</p>
              <p className="text-sm text-white/70">Высший класс</p>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-brand-sapphire flex items-center justify-center text-white font-bold text-lg">
              12
            </div>
            <div className="text-white min-w-0">
              <p className="font-semibold">SKU</p>
              <p className="text-sm text-white/70">В каталоге</p>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-brand-sapphire flex items-center justify-center text-white font-bold text-lg">
              РФ
            </div>
            <div className="text-white min-w-0">
              <p className="font-semibold">Авто / ж/д</p>
              <p className="text-sm text-white/70">Отгрузка по России</p>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
