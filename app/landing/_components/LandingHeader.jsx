'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

function LandingHeader() {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-5xl rounded-full mx-auto w-full bg-white">
      {/* Logo Section */}
      <a href="/" className="flex gap-2 items-center hover:opacity-80 transition">
        <Image src={'/logo.png'} width={30} height={30} alt="Logo" />
        <h2 className="font-bold text-2xl">
          Notes<span className="text-red-500 text-3xl">2</span>Card
        </h2>
      </a>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {!isSignedIn ? (
          <Link
            href="/sign-in"
            className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
          >
            Sign In
          </Link>
        ) : (
          <>
            <Link
              href="/dashboard"
              className="text-gray-900 hover:text-indigo-600 transition text-sm font-medium"
            >
              Dashboard
            </Link>
            <UserButton />
          </>
        )}
      </div>
    </header>
  );
}

export default LandingHeader;
