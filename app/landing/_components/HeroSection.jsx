'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white">
      {/* Background with Grid Pattern and Fade */}
      <div
        className="absolute inset-0 w-full"
        style={{
          backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), 
                          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '10px 10px',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          height: '90%',
        }}
      />

      {/* Content on top of background */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-42 pb-5 text-center">
        {/* Main Headline */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl">
          Learn Smarter With Your
          <br /> Personal AI Study Companion
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mb-6 max-w-2xl text-lg text-zinc-500">
          Transform your study sessions into personalized learning experiences. Generate and convert
          your notes into flashcards instantly with AI-powered insights.
        </p>

        {/* CTA Buttons - Always clear and visible */}
        <div className="flex flex-col gap-4 sm:flex-row items-center justify-center">
          <Link href="/dashboard">
            <Button size="lg">Get started</Button>
          </Link>
          <Link href="#product-demo">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
