import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

function MaterialCardItem({ item }) {
  return (
    <div className="border shadow-md rounded-lg p-5 flex flex-col items-center">
      <h2 className="p-1 px-2 bg-green-500 rounded-full text-white mb-1 text-[10px]">Ready!!</h2>
      <Image src={item.icon} alt={item.name} width={60} height={60} />
      <h2 className="font-medium mt-3">{item.name}</h2>
      <p className="text-gray-600 text-center mt-2 text-sm">{item.desc}</p>
      <Button className="mt-3 w-full cursor-pointer " variant="outline">
        View
      </Button>
    </div>
  );
}

export default MaterialCardItem;
