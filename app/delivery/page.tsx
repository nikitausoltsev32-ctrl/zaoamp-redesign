'use client'

import { SectionHeader } from '@/components/section-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Check
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils/products'

const deliveryRegions = [
  { 
    region: 'Екатеринбург', 
    price: 1500, 
    minCost: 3000,
    time: '1-2 дня',
    icon: MapPin
  },
  { 
    region: 'Уральский регион', 
    price: 2500, 
    minCost: 5000,
    time: '2-4 дня',
    icon: Truck
  },
  { 
    region: 'Москва и Центр', 
    price: 6000, 
    minCost: 12000,
    time: '5-7 дней',
    icon: Truck
  },
  { 
    region: 'Сибирь и Дальний Восток', 
    price: 8000, 
    minCost: 16000,
    time: '7-14 дней',
    icon: Truck
  },
  { 
    region: 'Юг России', 
    price: 6500, 
    minCost: 13000,
    time: '5-8 дней',
    icon: Truck
  },
  { 
    region: 'Самовывоз', 
    price: 0, 
    minCost: 0,
    time: 'В день заказа',
    icon: Package
  },
]

const packagingOptions = [
  { type: 'Навалом', price: 0, description: 'Без упаковки, машиной самосвал' },
  { type: 'Биг-бэг 1000 кг', price: 120, description: 'Мягкий контейнер на 1 тонну' },
  { type: 'Биг-бэг 500 кг', price: 120, description: 'Мягкий контейнер на 500 кг' },
  { type: 'Мешки 50 кг', price: 35, description: 'Полипропиленовые мешки' },
  { type: 'Мешки 25 кг', price: 25, description: 'Полипропиленовые мешки' },
]

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Условия доставки"
            subtitle="Доставка мраморной крошки и щебня по всей России"
            centered
          />
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              <Truck className="mr-1 h-3 w-3" />
              Автотранспорт
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Ж/Д перевозки
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Самовывоз
            </Badge>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">
            Стоимость доставки
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryRegions.map((region, index) => (
              <motion.div
                key={region.region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                        <region.icon className="h-5 w-5 text-brand-orange" />
                      </div>
                      <CardTitle className="text-lg">{region.region}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-brand-orange">
                        {region.price === 0 ? 'Бесплатно' : `от ${formatPrice(region.price)} ₽`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {region.price === 0 ? '' : 'за тонну'}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{region.time}</span>
                      </div>
                      {region.minCost > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span>Мин. заказ: {formatPrice(region.minCost)} ₽</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Варианты упаковки
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Выберите удобный способ фасовки продукции
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {packagingOptions.map((option, index) => (
              <motion.div
                key={option.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <Package className="h-8 w-8 mx-auto mb-3 text-brand-orange" />
                    <h3 className="font-semibold mb-1">{option.type}</h3>
                    <p className="text-2xl font-bold text-brand-orange mb-2">
                      {option.price === 0 ? 'Бесплатно' : `+${formatPrice(option.price)} ₽`}
                    </p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Важная информация
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Минимальный заказ</h3>
                  <p className="text-muted-foreground text-sm">
                    Доставка осуществляется от 20 тонн. Для меньших объемов — самовывоз.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Оплата</h3>
                  <p className="text-muted-foreground text-sm">
                    Работаем по предоплате 50% или по договору с отсрочкой платежа для постоянных клиентов.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Документы</h3>
                  <p className="text-muted-foreground text-sm">
                    Предоставляем все необходимые документы: сертификаты, паспорта качества, ТТН.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Ж/Д перевозки</h3>
                  <p className="text-muted-foreground text-sm">
                    Для крупных заказов от 100 тонн возможна доставка железнодорожным транспортом.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-brand-orange to-brand-gold">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Рассчитайте точную стоимость
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Используйте наш калькулятор для расчета стоимости с учетом доставки в ваш регион
          </p>
          <Button asChild size="lg" className="bg-white text-brand-orange hover:bg-white/90">
            <Link href="/#calculator">
              Открыть калькулятор
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
