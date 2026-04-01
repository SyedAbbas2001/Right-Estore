import HeroBanner from '@/components/home/HeroBanner';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import { StatsSection, TestimonialsSection, PromoBanner, TrustBadges, MarqueeBanner } from '@/components/home/HomeSections';

export const revalidate = 60; // Revalidate every 60 seconds

async function getFeaturedProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products?filter=featured&limit=8`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getNewProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products?filter=new&limit=4`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, newProducts] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
  ]);

  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <MarqueeBanner />
      <CategoriesSection />
      <FeaturedProducts initialProducts={featuredProducts} />
      <StatsSection />
      <PromoBanner />
      <NewArrivals initialProducts={newProducts} />
      <TestimonialsSection />
    </>
  );
}
