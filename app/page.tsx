import { HeroSection } from '@/components/sections/hero'
import { BenefitsSection } from '@/components/sections/benefits'
import { QuarrySection } from '@/components/sections/quarry-section'
import { FeaturedProductsSection } from '@/components/sections/featured-products'
import { CalculatorSection } from '@/components/sections/calculator-section'
import { CTASection } from '@/components/sections/cta-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <QuarrySection />
      <FeaturedProductsSection />
      <CalculatorSection />
      <CTASection />
    </>
  )
}
