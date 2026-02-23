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
  const [isMember, setIsMember] = useState(false);
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const { courseCount = 0 } = useContext(CourseCountContext) || {};
  const isOnDashboard =
    pathname === '/dashboard' ||
    pathname === '/dashboard/upgrade' ||
    pathname === '/dashboard/profile';
  // Extract courseId and check if on course subpage
  const courseMatch = pathname.match(/\/course\/([^/]+)(?:$|\/)/);
  const courseId = courseMatch ? courseMatch[1] : null;

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      fetch('/api/user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.emailAddresses[0].emailAddress }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isMember) setIsMember(true);
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <header className="flex items-center justify-between px-4 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full bg-white">
      <a href="/" className="flex-1 flex gap-2 items-center hover:opacity-80 transition">
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
        <Link href="/dashboard/profile" className="hover:text-indigo-600">
          Profile
        </Link>
        {!isOnDashboard ? (
          <a
            className="hover:text-indigo-600"
            href={courseId ? `/course/${courseId}` : '/dashboard'}
          >
            Course
          </a>
        ) : isMember ? (
          <Link href="/dashboard/upgrade" className="hover:text-indigo-600">
            My Subscription
          </Link>
        ) : (
          <Link href="/dashboard/upgrade" className="hover:text-indigo-600">
            Upgrade
          </Link>
        )}
        <a className="hover:text-indigo-600" href="/dashboard">
          Dashboard
        </a>

        <Button
          variant="outline"
          onClick={() => setIsMenuOpen(false)}
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
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </nav>

      <div className="flex-1 flex items-center justify-end space-x-4">
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
        {isOnDashboard && !isMember && (
          <HoverCard openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-full hover:bg-gray-100 transition">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
              <div className="border p-2 bg-slate-100 rounded-lg">
                <h2 className="text-lg mb-2">Available Credits : {5 - courseCount}</h2>
                <Progress value={(courseCount / 5) * 100} />
                <h2 className="text-sm">{courseCount} Out of 5 Credits Used</h2>
                <Link href="/dashboard/upgrade" className="text-primary text-xs mt-2 block">
                  Upgrade to Create More
                </Link>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
        <UserButton userProfileMode="navigation" userProfileUrl="/dashboard/profile" />
      </div>
    </header>
  );
}

export default DashboardHeader;
