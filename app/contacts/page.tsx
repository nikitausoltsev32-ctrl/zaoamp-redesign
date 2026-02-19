import type { Metadata } from 'next'
import { ContactForm, ContactInfo } from '@/components/sections/contacts/contact-form'
import { SectionHeader } from '@/components/section-header'

export const metadata: Metadata = {
  title: 'Контакты | ЗАО АМП ИМПОРТ-ЭКСПОРТ',
  description: 'Контакты компании ЗАО АМП ИМПОРТ-ЭКСПОРТ. Телефон: +7 (919) 393-19-92. Адрес: г. Екатеринбург, ул. Евгения Савкова 29, офис 262.',
  keywords: ['контакты', 'телефон', 'адрес', 'Екатеринбург', 'мраморная крошка'],
}

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-brand-ice-blue">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Контакты"
            subtitle="Свяжитесь с нами любым удобным способом"
            centered
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
            <ContactForm />
          </div>

          {/* Info & Map */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Наши контакты</h2>
            <ContactInfo />
            
            {/* Map */}
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 mb-3">Как найти</h3>
              <div className="aspect-video rounded-xl overflow-hidden border">
                <iframe
                  src="https://yandex.ru/map-widget/v1/-/CDX"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                г. Екатеринбург, ул. Евгения Савкова 29, офис 262
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
