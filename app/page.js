'use client';

import LandingHeader from './landing/_components/LandingHeader';
import HeroSection from './landing/_components/HeroSection';
import FeaturesSection from './landing/_components/FeaturesSection';
import ProductDemo from './landing/_components/ProductDemo';
import ReadySection from './landing/_components/ReadySection';
import { PageFooter } from '@/components/ui/PageFooter';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <div id="product-demo">
        <ProductDemo />
      </div>
      <ReadySection />
      <PageFooter />
    </div>
  );
}
