import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function CourseCardItems({ course }) {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="group border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 bg-white hover:border-primary/50">
      <div>
        <div className="flex justify-between items-center">
          <Image src={'/knowledge.png'} alt={'other'} width={50} height={50} />
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-primary text-white">
            {formatDate(course?.createdDate)}
          </h2>
        </div>
        <h2 className="mt-3 font-medium text-lg">{course?.courseLayout?.courseTitle}</h2>
        <p className="text-sm line-clamp-2 text-grey-500 mt-2">
          {course?.courseLayout?.courseSummary}
        </p>
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
