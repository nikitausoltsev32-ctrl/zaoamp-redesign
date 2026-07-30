import Image from 'next/image'

export function HeroBackgroundSlider() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/images/products/optimized/muka-0-0-2.webp"
        alt="Белая мраморная продукция АМП"
        fill
        className="object-cover"
        priority
        quality={65}
        sizes="100vw"
      />
      
      {/* Градиентные затемнения для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/55 z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-[2]" />
    </div>
  )
}
