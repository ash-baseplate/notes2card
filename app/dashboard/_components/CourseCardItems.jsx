import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function CourseCardItems({ course }) {
  return (
    <div className="group border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 bg-white hover:border-primary/50">
      <div>
        <div className="flex justify-between items-center">
          <Image src={'/knowledge.png'} alt={'other'} width={50} height={50} />
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-primary text-white">20/12/2025</h2>
        </div>
        <h2 className="mt-3 font-medium text-lg">{course?.courseLayout?.courseTitle}</h2>
        <p className="text-sm line-clamp-2 text-grey-500 mt-2">
          {course?.courseLayout?.courseSummary}
        </p>
        <div className="mt-3">
          <Progress value={10} />
        </div>
        <div className="flex justify-end mt-3">
          {course?.status == 'Generating' ? (
            <h2 className="text-sm p-1 px-2 flex gap-2 items-center rounded-full bg-gray-500 text-white">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Generating....
            </h2>
          ) : (
            <Link href={'course/' + course?.courseId}>
              <Button>View</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCardItems;
