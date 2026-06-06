'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, Send, CheckCircle2 } from 'lucide-react'
import { ymGoal } from '@/lib/analytics'
import { getUTMData } from '@/lib/hooks/use-utm'

export function SamplesCTA() {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !name || !city) return
    setStatus('loading')
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name,
          city,
          source: 'samples_request',
          productName: 'Набор образцов (7 видов)',
          utm: getUTMData(),
        }),
      })
      if (!response.ok) throw new Error()
      ymGoal('samples_request')
      setStatus('sent')
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section className="py-12 bg-stone-50 border-y border-stone-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Заявка на образцы принята!</h2>
          <p className="text-muted-foreground">Наш менеджер свяжется с вами для уточнения адреса доставки.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-brand-sapphire text-white border-y border-brand-sapphire-dark mt-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4">
              <Package className="h-4 w-4" /> B2B Клиентам
            </div>
            <h2 className="text-3xl font-bold mb-4">Сомневаетесь во фракции или цвете?</h2>
            <p className="text-brand-sapphire-light text-lg mb-6 leading-relaxed">
              Мы бесплатно отправим вам коробку с образцами нашей продукции (7 фракций крошки и щебня). Вы оплачиваете только услуги транспортной компании при получении.
            </p>
            <ul className="space-y-2 mb-8 text-brand-sapphire-light">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-white/80" /> Вживую оцените белизну 98%</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-white/80" /> Точно подберете фракцию для своих задач</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-white/80" /> Проверите прочность и качество</li>
            </ul>
          </div>
          
          <div className="bg-white text-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-center">Заказать набор образцов</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="samples-name" className="block text-sm font-medium text-gray-700 mb-1">Как к вам обращаться?</label>
                <Input 
                  id="samples-name"
                  placeholder="Иван Иванов" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="bg-stone-50"
                />
              </div>
              <div>
                <label htmlFor="samples-phone" className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <Input 
                  id="samples-phone"
                  type="tel" 
                  placeholder="+7 (___) ___-__-__" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  className="bg-stone-50"
                />
              </div>
              <div>
                <label htmlFor="samples-city" className="block text-sm font-medium text-gray-700 mb-1">Город доставки</label>
                <Input 
                  id="samples-city"
                  placeholder="Например, Москва" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  required 
                  className="bg-stone-50"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white mt-2" 
                size="lg"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Отправка...' : <><Send className="mr-2 h-4 w-4" /> Получить образцы</>}
              </Button>
              
              {status === 'error' && (
                <p className="text-sm text-red-500 text-center">Ошибка. Попробуйте ещё раз.</p>
              )}
              <p className="text-xs text-center text-stone-500 mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
