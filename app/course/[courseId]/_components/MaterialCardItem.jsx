import { Button } from '@/components/ui/button';
import axios from 'axios';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';

function MaterialCardItem({ item, studyTypeContent, course, refreshData }) {
  const [loading, setLoading] = useState(false);

  const isContentReady = studyTypeContent?.[item.type]?.length != null;

  const GenerateContent = async () => {
    toast.success('Content generation started! It may take a few minutes.');
    setLoading(true);
    console.log(course);

    let chapters = '';
    course?.courseLayout?.chapters?.forEach((chapter) => {
      chapters = (chapter.chapterTitle || chapter.chapter_title) + ', ' + chapters;
    });
    const result = await axios.post('/api/generate-study-type-content', {
      courseId: course?.courseId,
      type: item.name,
      chapters: chapters,
    });
    setLoading(false);
    console.log(result);
    refreshData(true);
    toast.success('Content generation request submitted successfully!');
  };

  const handleCardClick = () => {
    if (!isContentReady) {
      toast.error('Content is still being generated. Please wait...');
      return;
    }
  };

  return (
    <Link
      href={isContentReady ? '/course/' + course?.courseId + item.path : '#'}
      onClick={handleCardClick}
    >
      <div
        className={`border shadow-md rounded-lg p-5 flex flex-col items-center
      ${isContentReady ? 'bg-white' : 'bg-gray-100 opacity-50'}
      `}
      >
        {isContentReady ? (
          <h2 className="p-1 px-2 bg-green-500 rounded-full text-white mb-1 text-[10px]">
            Ready!!
          </h2>
        ) : (
          <h2 className="p-1 px-2 bg-Gray-500 rounded-full text-white mb-1 text-[10px]">Genrate</h2>
        )}
        <Image src={item.icon} alt={item.name} width={60} height={60} />
        <h2 className="font-medium mt-3">{item.name}</h2>
        <p className="text-gray-600 text-center mt-2 text-sm">{item.desc}</p>
        {isContentReady ? (
          <Button className="mt-3 w-full cursor-pointer " variant="outline">
            View
          </Button>
        ) : (
          <Button
            className="mt-3 w-full cursor-pointer "
            variant="outline"
            onClick={() => GenerateContent()}
          >
            {loading && <RefreshCcw className="animate-spin" />}Generate
          </Button>
        )}
      </div>
    </Link>
  );
}

export default MaterialCardItem;
