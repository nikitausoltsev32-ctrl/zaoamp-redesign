'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, FileText } from 'lucide-react'
import { HeroBackgroundSlider } from '@/components/hero-background-slider'

export function HeroSection() {
  const [kpOpen, setKpOpen] = useState(false)
  const [kpPhone, setKpPhone] = useState('')
  const [kpSubmitted, setKpSubmitted] = useState(false)
  const [kpLoading, setKpLoading] = useState(false)
  const [kpError, setKpError] = useState<string | null>(null)

  const handleKpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const phone = kpPhone.trim()
    if (!phone) return
    setKpLoading(true)
    setKpError(null)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, source: 'hero' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Ошибка отправки')
      setKpSubmitted(true)
    } catch (err) {
      setKpError(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setKpLoading(false)
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Фоновый слайдер с фото материала */}
      <HeroBackgroundSlider />
      
      {/* Контент поверх фона */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <Badge className="w-fit bg-brand-sapphire text-white hover:bg-brand-sapphire-dark border-0 text-sm px-4 py-1">
              Производитель №1 на Урале
            </Badge>
            
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              Мраморная крошка и щебень{' '}
              <span className="text-brand-powder-blue">премиум-качества</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">
              Белизна 98%. Доставка по всей России.{' '}
              <span className="font-bold text-white">От 2 900 ₽/тонна</span>.
              Собственное месторождение белого мрамора.
            </p>

            <Dialog
              open={kpOpen}
              onOpenChange={(open) => {
                setKpOpen(open)
                if (!open) {
                  setKpPhone('')
                  setKpSubmitted(false)
                  setKpError(null)
                }
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Получить КП за 3 минуты</DialogTitle>
                  <DialogDescription>
                    Оставьте номер телефона и мы вам перезвоним
                  </DialogDescription>
                </DialogHeader>
                {kpSubmitted ? (
                  <p className="text-sm text-green-600 py-4">
                    Спасибо! Мы перезвоним в ближайшее время.
                  </p>
                ) : (
                  <form onSubmit={handleKpSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-kp-phone">Телефон</Label>
                      <Input
                        id="hero-kp-phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={kpPhone}
                        onChange={(e) => setKpPhone(e.target.value)}
                        required
                        disabled={kpLoading}
                        className="w-full"
                      />
                    </div>
                    {kpError && (
                      <p className="text-sm text-destructive">{kpError}</p>
                    )}
                    <DialogFooter>
                      <Button type="submit" disabled={kpLoading}>
                        {kpLoading ? 'Отправка...' : 'Отправить'}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
            
          </motion.div>
        </div>

        {/* Кнопки — на всю ширину */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <Button
            asChild
            size="lg"
            className="bg-brand-sapphire hover:bg-brand-sapphire-dark text-white border-0 w-full"
          >
            <Link href="/catalog" className="w-full flex justify-center">
              Каталог продукции
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white w-full"
          >
            <Link href="/#calculator" className="w-full flex justify-center">
              <Calculator className="mr-2 h-4 w-4" />
              Рассчитать стоимость
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white w-full"
            onClick={() => setKpOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Получить КП за 3 минуты
          </Button>
        </div>

        {/* Преимущества — на всю ширину */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <motion.div 
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
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
              45к
            </div>
            <div className="text-white min-w-0">
              <p className="font-semibold">тонн/мес</p>
              <p className="text-sm text-white/70">Производство</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              300+
            </div>
            <div className="text-white min-w-0">
              <p className="font-semibold">Клиентов</p>
              <p className="text-sm text-white/70">По всей России</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
