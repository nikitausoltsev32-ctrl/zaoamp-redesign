import { HeroSection } from '@/components/sections/hero'
import { BenefitsSection } from '@/components/sections/benefits'
import { FeaturedProductsSection } from '@/components/sections/featured-products'
import { CalculatorSection } from '@/components/sections/calculator-section'
import { CTASection } from '@/components/sections/cta-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturedProductsSection />
      <CalculatorSection />
      <CTASection />
    </>
  )
}
