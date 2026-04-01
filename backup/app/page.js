import HeroBanner from '@/components/home/HeroBanner';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import { StatsSection, TestimonialsSection, PromoBanner, TrustBadges, MarqueeBanner } from '@/components/home/HomeSections';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <MarqueeBanner />
      <CategoriesSection />
      <FeaturedProducts />
      <StatsSection />
      <PromoBanner />
      <NewArrivals />
      <TestimonialsSection />
    </>
  );
}
