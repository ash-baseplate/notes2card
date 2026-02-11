'use client';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';
import Typewriter from 'typewriter-effect';

function WelcomeBanner() {
  const { user } = useUser();
  return (
    <div className="p-4 md:p-5 bg-blue-400 w-full text-white rounded-lg flex flex-col md:flex-row items-center gap-4 md:gap-7">
      <Image
        src={'/laptop.png'}
        alt="laptop"
        width={100}
        height={100}
        className="w-16 h-16 md:w-[100px] md:h-[100px]"
      />
      <div className="text-center md:text-left">
        <div
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 'bold',
            display: 'inline-block',
          }}
          className="text-xl md:text-3xl lg:text-4xl"
        >
          <Typewriter
            options={{
              strings: [`Hello, ${user?.firstName || 'Learner'}! `],
              autoStart: true,
              loop: false,
              cursor: '',
              deleteSpeed: Infinity,
            }}
          />
        </div>
        <p className="text-sm md:text-base">
          Hey there once again, it's time to get back and{' '}
          <b className="text-red-300 text-base md:text-lg">START LEARNING</b> a new course{' '}
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
