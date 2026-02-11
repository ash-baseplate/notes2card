'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ReadySection() {
  return (
    <section className="w-full bg-gray-50 px-6 py-10 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Are you ready?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
            Transform the way you study with AI-powered learning. Start creating personalized study
            materials in seconds.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link href="/dashboard">
            <Button size="lg">
              Get started <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Subtext */}
        <p className="text-sm text-gray-600 pt-2">No credit card required. Free to try forever.</p>
      </div>
    </section>
  );
}
