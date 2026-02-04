'use client';

import LandingHeader from './landing/_components/LandingHeader';

import HeroSection from './landing/_components/HeroSection';
import FeaturesSection from './landing/_components/FeaturesSection';
import ProductDemo from './landing/_components/ProductDemo';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <div id="product-demo">
        <ProductDemo />
      </div>

      {/* Footer Section */}
      <section className="w-full bg-white px-6 pt-12 text-center">
        <p className="text-xs text-zinc-500">
          MADE WITH <span className="text-lg">♡</span>
        </p>
      </section>
    </div>
  );
}
