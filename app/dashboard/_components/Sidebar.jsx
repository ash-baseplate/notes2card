'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { use } from 'react';
import Dashboard from '../page';
import { CircleFadingArrowUp, LayoutDashboard, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

function Sidebar() {
  const MenuList = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'Upgrade',
      icon: CircleFadingArrowUp,
      path: '/dashboard/upgrade',
    },
    {
      name: 'Profile',
      icon: UserCircle,
      path: '/dashboard/profile',
    },
  ];
  const path = usePathname();
  return (
    <div className="h-screen shadow-md p-5">
      <div className="flex gap-4 items-center ">
        <Image src={'/logo.svg'} width={40} height={40} alt="Logo" />
        <h2 className="font-bold text-2xl">Notes2Card</h2>
      </div>

      <div className="mt-10">
        <Link href="/create " className="w-full">
          <Button className="w-full">+ Create New</Button>
        </Link>

        <div className="mt-5">
          {MenuList.map((menu, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-gray-200 ${
                path === menu.path && 'bg-gray-200 font-semibold'
              }`}
            >
              <menu.icon />
              <span>{menu.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border p-2 bg-slate-100 rounded-lg absolute bottom-10 w-[85%] ">
        <h2 className="text-lg mb-2">Avaliable Credits : 5</h2>
        <Progress value={30} />
        <h2 className="text-sm">1 Out of 5 Credits Used</h2>

        <Link href={'/dashboard/upgrade'} className="text-primary text-xs mt-2">
          Upgrade to Create More
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
