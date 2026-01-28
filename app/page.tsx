import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import FeaturedFarms from '@/components/FeaturedFarms'
import Categories from '@/components/Categories'
import TrustBadges from '@/components/TrustBadges'
import Newsletter from '@/components/Newsletter'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <FeaturedFarms />
      <Categories />
      <TrustBadges />
      <Newsletter />
    </main>
  )
}
