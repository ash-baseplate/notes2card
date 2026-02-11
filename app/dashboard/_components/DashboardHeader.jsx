'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CourseCountContext } from '@/app/_context/CourseCountContext';

function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDate, setUserDate] = useState(null);
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const { courseCount = 0 } = useContext(CourseCountContext) || {};
  const isOnDashboard = pathname === '/dashboard';

  // Extract courseId and check if on course subpage
  const courseMatch = pathname.match(/\/course\/([^/]+)\//);
  const courseId = courseMatch ? courseMatch[1] : null;

  useEffect(() => {
    if (user?.createdAt) {
      setUserDate(
        new Date(user.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    }
  }, [user]);

  return (
    <header className="flex items-center justify-between px-4 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full bg-white">
      <a href="/" className="flex gap-2 items-center hover:opacity-80 transition">
        <Image src={'/logo.png'} width={30} height={30} alt="Logo" />
        <h2 className="font-bold text-xl">
          Notes<span className="text-red-500 text-2xl">2</span>Card
        </h2>
      </a>
      <nav
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full transition-[width] bg-white/50 backdrop-blur flex-col md:flex-row flex gap-4 text-gray-900 text-sm font-normal ${
          isMenuOpen ? 'max-md:w-full' : 'max-md:w-0'
        }`}
      >
        <a className="hover:text-indigo-600" href="/dashboard">
          Dashboard
        </a>
        {!isOnDashboard ? (
          <a className="hover:text-indigo-600" href={`/course/${courseId}`}>
            Course
          </a>
        ) : (
          <HoverCard openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button variant="link">My Credits</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
              <div className="border p-2 bg-slate-100 rounded-lg">
                <h2 className="text-lg mb-2">Available Credits : {5 - courseCount}</h2>
                <Progress value={(courseCount / 5) * 100} />
                <h2 className="text-sm">{courseCount} Out of 5 Credits Used</h2>

                <Link href={'/dashboard/upgrade'} className="text-primary text-xs mt-2 block">
                  Upgrade to Create More
                </Link>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
        <HoverCard>
          <HoverCardTrigger asChild>
            <a className="hover:text-indigo-600 cursor-pointer">Profile</a>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">
                {user?.firstName} {user?.lastName}
              </h4>
              <p className="text-sm text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
              {userDate && <p className="text-xs text-gray-500">Member since: {userDate}</p>}
            </div>
          </HoverCardContent>
        </HoverCard>
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

      <div className="flex items-center space-x-4">
        <a
          className={`${isSignedIn ? 'hidden' : 'hidden md:flex'} bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition`}
          href="#"
        >
          Sign up
        </a>
        <Button
          variant="outline"
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden text-gray-600"
        >
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
        </Button>
        <Button asChild variant="ghost" className="p-2  rounded-full hover:bg-gray-400 transition">
          <a
            href="https://github.com/ash-baseplate/notes2card.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </Button>
        <UserButton />
      </div>
    </header>
  );
}

export default DashboardHeader;
