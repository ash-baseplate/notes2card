'use client';

import { PageFooter } from '@/components/ui/PageFooter';
import FeaturesSection from './_components/FeaturesSection';
import HeroSection from './_components/HeroSection';
import LandingHeader from './_components/LandingHeader';
import ProductDemo from './_components/ProductDemo';
import ReadySection from './_components/ReadySection';

export default function LandingPage() {
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
