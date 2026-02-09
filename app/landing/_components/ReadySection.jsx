'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ReadySection() {
  return (
    <section className="w-full bg-gradient-to-b from-white via-indigo-50 to-white px-6 py-18 md:py-18">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Heading */}
        <div className="space-y-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Are you ready?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your learning with AI-powered study materials <br /> personalized just for
            you.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row items-center justify-center">
          <Link href="/dashboard">
            <Button size="lg">Get started</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
