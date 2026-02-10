'use client'

import { Phone, MessageCircle, Send, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/section-header'

export function ProductCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Остались вопросы?"
            subtitle="Наши специалисты помогут подобрать оптимальное решение для ваших задач"
            centered
            className="text-white"
          />

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <a href="tel:+79193931992">
                <Phone className="mr-2 h-4 w-4" />
                Позвонить
              </a>
            </Button>
            <Button 
              asChild 
              size="lg"
              className="bg-green-500 text-white hover:bg-green-600 border-0"
            >
              <a href="https://wa.me/79193931992" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              <a href="https://t.me/usolst" target="_blank" rel="noopener noreferrer">
                <Send className="mr-2 h-4 w-4" />
                Telegram
              </a>
            </Button>
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              <a href="mailto:evoprod@mail.ru">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Работаем ежедневно с 9:00 до 18:00 (мск)
          </p>
        </motion.div>
      </div>
    </section>
  )
}
