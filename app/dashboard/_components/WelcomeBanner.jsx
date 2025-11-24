"use client"
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WelcomeBanner() {
    const { user } = useUser();
    return (
        <div className='p-5 bg-blue-300 w-full text-white rounded-lg flex items-center gap-7'>
            <Image src={'/laptop.png'} alt='laptop' width={100} height={100} />
            <div>
                <h2 className='font-bold text-4xl'>Hello, {user?.firstName}</h2>
                <p className='text-m'>Hey! there once again, its time to get back and <b className='text-slate-100'>START LEARNING</b> new course </p>
            </div>
        </div>
    )
}

export default WelcomeBanner