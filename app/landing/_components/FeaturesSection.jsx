'use client';

import { Brain, BookOpen, Target } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="w-full bg-white px-6 py-5">
      <div className="mx-auto max-w-6xl">
        {/* Section Title */}
        <h2 className="mb-7 text-center text-xl font-semibold text-zinc-900">
          Experience the power of:
        </h2>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature Card 1 */}

          <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900">
              <Brain className="h-6 w-6 text-zinc-900" /> AI Study Materials
            </h3>
            <p className="text-zinc-500">
              Instantly transform any topic into comprehensive course outlines, chapter notes, and
              exam content.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900">
              <BookOpen className="h-6 w-6 text-zinc-900" /> Multiple Study Formats
            </h3>
            <p className="text-zinc-500">
              Choose from flashcards, exam prep, interview questions, practice sets, and more.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900">
              <Target className="h-6 w-6 text-zinc-900" /> Custom Learning
            </h3>
            <p className="text-zinc-500">
              Adjust difficulty levels and learning goals to match your exact needs and pace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
