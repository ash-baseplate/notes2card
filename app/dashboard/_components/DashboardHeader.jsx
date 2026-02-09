'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  // Extract courseId and check if on course subpage
  const courseMatch = pathname.match(/\/course\/([^/]+)\//);
  const courseId = courseMatch ? courseMatch[1] : null;
  const isOnCourseSubpage = /\/(notes|flashcards)/.test(pathname);

  return (
    <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full bg-white">
      <a href="/" className="flex gap-2 items-center hover:opacity-80 transition">
        <Image src={'/logo.png'} width={30} height={30} alt="Logo" />
        <h2 className="font-bold text-2xl">
          Notes<span className="text-red-500 text-3xl">2</span>Card
        </h2>
      </a>
      <nav
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full transition-[width] bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal ${
          isMenuOpen ? 'max-md:w-full' : 'max-md:w-0'
        }`}
      >
        <a className="hover:text-indigo-600" href="/dashboard">
          Dashboard
        </a>
        {isOnCourseSubpage && courseId ? (
          <a className="hover:text-indigo-600" href={`/course/${courseId}`}>
            Course
          </a>
        ) : (
          <a className="hover:text-indigo-600" href="#">
            Upgrade
          </a>
        )}
        <a className="hover:text-indigo-600" href="#">
          Profile
        </a>
        <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>
      {/* // Right Side //hover card for credits */}
      <div className="flex items-center space-x-4">
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="link">My Credits</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="border p-2 bg-slate-100 rounded-lg">
              <h2 className="text-lg mb-2">Available Credits : 5</h2>
              <Progress value={20} />
              <h2 className="text-sm">1 Out of 5 Credits Used</h2>

              <Link href={'/dashboard/upgrade'} className="text-primary text-xs mt-2 block">
                Upgrade to Create More
              </Link>
            </div>
          </HoverCardContent>
        </HoverCard>
        <a
          className={`${isSignedIn ? 'hidden' : 'hidden md:flex'} bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition`}
          href="#"
        >
          Sign up
        </a>
        <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <UserButton />
      </div>
    </header>
  );
}

export default DashboardHeader;
