'use client'

import { Button } from '@/components/ui/button'
import { Phone, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-orange via-orange-500 to-brand-gold">
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
              className="bg-white text-brand-orange hover:bg-white/90"
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
                Написать в WhatsApp
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
