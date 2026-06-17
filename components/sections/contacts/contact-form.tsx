'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { m } from 'framer-motion'
import { ymGoal } from '@/lib/analytics'

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
        <m.div
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
                    onClick={() => contact.href?.startsWith('tel:') && ymGoal('phone_click')}
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
        </m.div>
      ))}

      {/* Quick links */}
      <div className="pt-4">
        <h3 className="font-medium text-gray-900 mb-3">Быстрые контакты</h3>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <a href="https://wa.me/79193931992" target="_blank" rel="noopener noreferrer" onClick={() => ymGoal('whatsapp_click')}>
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
