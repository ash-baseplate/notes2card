'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
  Target,
  Sparkles,
  Database,
  Github,
  Cloud,
  ZapIcon,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function ProductDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const demoSteps = [
    {
      title: 'Enter Your Topic',
      subtitle: 'Start by entering any topic or subject you want to study',
      icon: Brain,
      screenshot: (
        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-white p-8 rounded-lg flex flex-col items-center justify-center space-y-6">
          <div className="w-full max-w-md space-y-4">
            <label className="block text-sm font-semibold text-gray-900">Select Study Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border-2 border-indigo-600 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100">
                Flashcards
              </button>
              <button className="p-3 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300">
                Quiz
              </button>
              <button className="p-3 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300">
                Q&A
              </button>
              <button className="p-3 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300">
                Exam Prep
              </button>
            </div>
          </div>
          <div className="w-full max-w-md space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Topic</label>
            <input
              type="text"
              placeholder="e.g., React Hooks, Machine Learning..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              defaultValue="React Hooks"
            />
          </div>
          <div className="w-full max-w-md space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Difficulty Level</label>
            <select
              defaultValue="Intermediate"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option>Easy</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
      ),
      description:
        'Select from 4 different study formats and 3 different difficulty levels. The app supports flashcards, quizzes, Q&A, and exam prep materials personalized just for you.',
    },
    {
      title: 'AI Generates Content',
      subtitle: 'Our AI creates comprehensive study materials instantly',
      icon: Zap,
      screenshot: (
        <div className="w-full h-full bg-gradient-to-br from-purple-50 to-white p-8 rounded-lg flex flex-col items-center justify-center space-y-6">
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-purple-100 rounded-lg animate-pulse">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-sm text-purple-900 font-medium">
                Generating course structure...
              </span>
            </div>
            <div className="space-y-3">
              {[
                'Creating chapters',
                'Writing detailed notes',
                'Building flashcards',
                'Generating quiz questions',
              ].map((task, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${idx < 2 ? 'bg-green-50' : idx === 2 ? 'bg-blue-100 animate-pulse' : 'bg-gray-50'}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${idx < 2 ? 'bg-green-500' : idx === 2 ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    {idx < 2 ? '✓' : idx === 2 ? '⟳' : ''}
                  </div>
                  <span className="text-sm text-gray-700">{task}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">This usually takes 3-4 minutes</p>
            </div>
          </div>
        </div>
      ),
      description:
        'The AI generates comprehensive course outlines with multiple chapters, detailed notes, flashcards, and quiz questions tailored to your topic.',
    },
    {
      title: 'Study with Flashcards',
      subtitle: 'Interactive flashcards to master key concepts',
      icon: BookOpen,
      screenshot: (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg flex flex-col items-center justify-center space-y-6">
          <div className="w-full max-w-md">
            <div
              style={{
                perspective: '1000px',
                width: '100%',
                maxWidth: '500px',
                height: '300px',
                position: 'relative',
              }}
            >
              {/* Front - Question */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: '0',
                  left: '0',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease-in-out',
                  zIndex: isFlipped ? '1' : '2',
                }}
                className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <p className="text-xs font-bold tracking-widest mb-6 uppercase text-gray-400">
                  Question
                </p>
                <h2 className="text-2xl font-bold text-center leading-relaxed mb-6 flex-1 flex items-center text-gray-900">
                  What is the difference between useState and useReducer?
                </h2>
                <p className="text-sm flex items-center space-x-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7m0 0l-7 7m7-7H6"
                    />
                  </svg>
                  <span>Click to reveal answer</span>
                </p>
              </div>

              {/* Back - Answer */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: '0',
                  left: '0',
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease-in-out',
                  zIndex: isFlipped ? '2' : '1',
                }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-600 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <p className="text-xs font-bold tracking-widest mb-6 uppercase text-blue-200">
                  Answer
                </p>
                <h2 className="text-2xl font-bold text-center leading-relaxed mb-6 flex-1 flex items-center text-white">
                  useState is for simple local state, while useReducer is for complex state logic
                  with multiple related values.
                </h2>
                <p className="text-sm flex items-center space-x-2 text-blue-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Click to hide answer</span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-600">Card 1 of 8</span>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ),
      description:
        'Interactive flashcards with flip animations. Click to reveal answers and practice concepts efficiently. Perfect for memorization and quick reviews.',
    },
    {
      title: 'Read Comprehensive Notes',
      subtitle: 'Organized chapters with detailed content',
      icon: Target,
      screenshot: (
        <div className="w-full h-full bg-gradient-to-br from-amber-50 to-white p-8 rounded-lg flex flex-col items-center justify-center space-y-4">
          <div className="w-full max-w-md space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">Chapter 1: React Hooks Basics</h3>
              <p className="text-sm text-gray-600">
                Learn the fundamentals of React Hooks and how they simplify state management...
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 max-h-40 overflow-y-auto">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">📌 What are Hooks?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Hooks are functions that let you "hook into" React features. They allow you to use
                  state and other React features in functional components.
                </p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">🎯 useState Hook</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The useState hook lets you add state to functional components. It returns an array
                  with two elements...
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      description:
        'Well-organized chapter notes with detailed explanations, examples, and key concepts. Perfect for deep learning and comprehensive understanding.',
    },
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  const CurrentIcon = demoSteps[currentStep].icon;

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white px-6 pt-18 pb-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">See How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform any topic into a complete study system in just a few clicks
          </p>
        </div>

        {/* Demo Container */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CurrentIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {demoSteps[currentStep].title}
                </h3>
                <p className="text-gray-600">{demoSteps[currentStep].subtitle}</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed text-lg">
              {demoSteps[currentStep].description}
            </p>

            {/* Step Indicators */}
            {/* <div className="flex items-center space-x-3 pt-4">
              {demoSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep ? 'bg-indigo-600 w-8' : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div> */}

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <Button onClick={prevStep} variant="outline" size="icon" className="rounded-full">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Button>
              <span className="text-sm font-medium text-gray-600">
                {currentStep + 1} of {demoSteps.length}
              </span>
              <Button onClick={nextStep} variant="outline" size="icon" className="rounded-full">
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </Button>
            </div>

            {/* Tech Stack Section */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                POWERED BY
              </p>

              <div className="flex flex-wrap gap-2">
                {/* Frontend */}
                <div className="px-3 py-1.5 bg-gradient-to-r from-black to-gray-800 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="w-3.5 h-3.5 bg-white rounded-sm flex items-center justify-center text-xs font-bold text-black">
                    N
                  </div>
                  <span className="text-xs text-white font-semibold">Next.js</span>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <span className="text-white text-sm">⚛</span>
                  <span className="text-xs text-white font-semibold">React</span>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <span className="text-white text-sm">◆</span>
                  <span className="text-xs text-white font-semibold">Tailwind</span>
                </div>

                {/* AI & Services */}
                <div className="px-3 py-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs text-white font-semibold">Google AI</span>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <ZapIcon className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs text-white font-semibold">Inngest</span>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Database className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs text-white font-semibold">Drizzle</span>
                </div>

                {/* Infrastructure */}
                <div className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <span className="text-white text-sm">💳</span>
                  <span className="text-xs text-white font-semibold">Stripe</span>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Cloud className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs text-white font-semibold">Vercel</span>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Github className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs text-white font-semibold">GitHub</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Screenshot */}
          <div className="relative h-96 md:h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="w-full h-full">{demoSteps[currentStep].screenshot}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
