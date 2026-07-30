import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Drill, Truck, Layers, Boxes } from 'lucide-react'
import { MediaSlot } from '@/components/media-slot'

const features = [
  {
    icon: Drill,
    title: 'Буровзрывная добыча',
    description: 'Порода добывается буровзрывным методом на открытом карьере'
  },
  {
    icon: Truck,
    title: 'Hitachi и Hyundai',
    description: 'Погрузка экскаваторами Hitachi и Hyundai на самосвалы КАМАЗ 25 т'
  },
  {
    icon: Layers,
    title: 'Дробление и грохочение',
    description: 'Многоступенчатое дробление и разделение на фракции через грохоты'
  },
  {
    icon: Boxes,
    title: 'Упаковка и отгрузка',
    description: 'Биг-бэги 500 кг / 1 т или навал — готово к автоперевозке и ж/д'
  }
]

export function QuarrySection() {
  return (
    <section id="quarry" className="content-auto py-16 md:py-24 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div>
            <Badge className="mb-4 bg-brand-sapphire/10 text-brand-sapphire hover:bg-brand-sapphire/20">
              Производство
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Наш карьер
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Загляните на наше месторождение, где добывается уникальный белый мрамор 
              премиум-качества.
            </p>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="relative group">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/quarry/quarry-1.jpg"
                alt="Мраморный карьер - вид на добычу"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-semibold text-lg">
                  Месторождение в Челябинской области
                </p>
                <p className="text-white/80 text-sm">
                  Добыча белого мрамора высшего качества
                </p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/quarry/quarry-2.jpg"
                alt="Мраморный карьер - масштаб производства"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-semibold text-lg">
                  Профессиональная техника
                </p>
                <p className="text-white/80 text-sm">
                  Современное оборудование для добычи
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Third Image - Full Width */}
        <MediaSlot
          title="Фото месторождения: блоки белого мрамора"
          caption="Именованный слот для подтверждённого фото сырья с месторождения. Файл в исходных материалах отсутствует."
          className="mb-12 min-h-64 md:mb-16"
        />

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-sapphire/10 text-brand-sapphire mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}
