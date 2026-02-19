'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from '@/components/section-header'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Заглушка для отправки
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Спасибо за обращение!
        </h3>
        <p className="text-green-700">
          Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ваше имя *</Label>
          <Input id="name" name="name" required placeholder="Иван Иванов" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Телефон *</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="+7 (999) 999-99-99" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="example@mail.ru" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Сообщение *</Label>
        <Textarea 
          id="message" 
          name="message" 
          required 
          placeholder="Опишите ваш запрос..."
          rows={4}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-brand-sapphire hover:bg-brand-sapphire-dark"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          'Отправка...'
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Отправить сообщение
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
      </p>
    </form>
  )
}

const contacts = [
  {
    icon: Phone,
    title: 'Телефон',
    value: '+7 (919) 393-19-92',
    href: 'tel:+79193931992',
    description: 'Звоните с 9:00 до 18:00'
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'evoprod@mail.ru',
    href: 'mailto:evoprod@mail.ru',
    description: 'Ответим в течение дня'
  },
  {
    icon: MapPin,
    title: 'Адрес',
    value: 'г. Екатеринбург, ул. Евгения Савкова 29, офис 262',
    href: 'https://yandex.ru/maps/-/CDX', 
    description: 'Офис и пункт выдачи'
  },
  {
    icon: Clock,
    title: 'Режим работы',
    value: 'Пн-Пт: 9:00 - 18:00',
    description: 'Сб-Вс: выходной'
  }
]

export function ContactInfo() {
  return (
    <div className="space-y-4">
      {contacts.map((contact, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-sapphire/10 flex items-center justify-center flex-shrink-0">
                <contact.icon className="h-5 w-5 text-brand-sapphire" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{contact.title}</h3>
                {contact.href ? (
                  <a 
                    href={contact.href} 
                    className="text-brand-sapphire hover:underline font-medium"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="font-medium">{contact.value}</p>
                )}
                <p className="text-sm text-muted-foreground">{contact.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Quick links */}
      <div className="pt-4">
        <h3 className="font-medium text-gray-900 mb-3">Быстрые контакты</h3>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <a href="https://wa.me/79193931992" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href="https://t.me/usolst" target="_blank" rel="noopener noreferrer">
              <Send className="mr-2 h-4 w-4" />
              Telegram
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
