'use client';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';
import Typewriter from 'typewriter-effect';

function WelcomeBanner() {
  const { user } = useUser();
  return (
    <div className="p-5 bg-blue-400 w-full text-white rounded-lg flex items-center gap-7">
      <Image src={'/laptop.png'} alt="laptop" width={100} height={100} />
      <div>
        {' '}
        <div
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 'bold',
            fontSize: '3em',
            display: 'inline-block',
          }}
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
        <p className="text-m">
          Hey! there once again, its time to get back and{' '}
          <b className="text-red-300 text-lg">START LEARNING</b> new course{' '}
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
