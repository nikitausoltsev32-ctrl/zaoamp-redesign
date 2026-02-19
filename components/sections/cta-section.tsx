'use client'

import { Button } from '@/components/ui/button'
import { Phone, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { contactInfo } from '@/lib/data/contacts'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-sapphire via-blue-600 to-brand-deep-navy">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">
            Нужна консультация?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Наши специалисты помогут подобрать оптимальную фракцию мрамора под ваши задачи. 
            Ответим на все вопросы и рассчитаем стоимость.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="bg-brand-ice-blue text-brand-sapphire hover:bg-brand-ice-blue/90"
            >
              <a href="tel:+79193931992">
                <Phone className="mr-2 h-4 w-4" />
                Позвонить
              </a>
            </Button>
            <Button 
              asChild 
              size="lg"
              className="bg-purple-500 text-white hover:bg-purple-600 border-0"
            >
              <a href="https://wa.me/79193931992" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Написать в MAX
              </a>
            </Button>
            <Button 
              asChild 
              size="lg"
              className="bg-blue-500 text-white hover:bg-blue-600 border-0"
            >
              <a href={`https://t.me/${contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Написать в Telegram
              </a>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-white/80">
            Или звоните: <a href="tel:+79193931992" className="font-semibold underline">+7 (919) 393-19-92</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
