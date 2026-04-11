import { Button } from '@/components/ui/button';
import axios from 'axios';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function MaterialCardItem({ item, studyTypeContent, isPending, canGenerate, course, refreshData }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const itemPath = (item.path || '').trim();

  // Check if content exists (works for both arrays and objects)
  const isContentReady = studyTypeContent?.[item.type] != null;
  const isGenerating = isPending;

  const GenerateContent = async () => {
    if (loading || isGenerating || !canGenerate) return;

    toast.success('Content generation started! It may take a few minutes.');
    setLoading(true);

    const chapters =
      course?.courseLayout?.chapters
        ?.map((chapter) => chapter.chapterTitle || chapter.chapter_title)
        .filter(Boolean)
        .join(', ') || '';
    try {
      await axios.post('/api/generate-study-type-content', {
        courseId: course?.courseId,
        type: item.type,
        chapters,
      });
      refreshData({ requestedType: item.type });
      toast.success('Content generation request submitted successfully!');
    } catch (error) {
      const serverMessage = error?.response?.data?.error;
      toast.error(serverMessage || 'Unable to generate content right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!isContentReady) {
      if (isGenerating) {
        toast.error('Content is generating. Please refresh after it completes.');
        return;
      }

      if (!canGenerate) {
        toast.error('Notes are generated with the course outline. Refresh to check availability.');
        return;
      }

      toast.error('Content is not ready yet. Please try again after refresh.');
      return;
    }

    router.push('/course/' + course?.courseId + itemPath);
  };

  return (
    <div onClick={handleCardClick} className={isContentReady ? 'cursor-pointer' : 'cursor-default'}>
      <div
        className={`border shadow-md rounded-lg p-5 flex flex-col items-center
      ${isContentReady ? 'bg-white' : 'bg-gray-100 opacity-50'}
      `}
      >
        {isContentReady ? (
          <h2 className="p-1 px-2 bg-green-500 rounded-full text-white mb-1 text-[10px]">
            Ready!!
          </h2>
        ) : isGenerating ? (
          <h2 className="p-1 px-2 bg-blue-500 rounded-full text-white mb-1 text-[10px]">
            Generating
          </h2>
        ) : (
          <h2 className="p-1 px-2 bg-gray-500 rounded-full text-white mb-1 text-[10px]">Genrate</h2>
        )}
        <Image src={item.icon} alt={item.name} width={60} height={60} />
        <h2 className="font-medium mt-3">{item.name}</h2>
        <p className="text-gray-600 text-center mt-2 text-sm">{item.desc}</p>
        {isContentReady ? (
          <Button className="mt-3 w-full cursor-pointer " variant="outline">
            View
          </Button>
        ) : canGenerate ? (
          <Button
            className="mt-3 w-full cursor-pointer "
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              GenerateContent();
            }}
            disabled={loading || isGenerating}
          >
            {(loading || isGenerating) && <RefreshCcw className="animate-spin" />}
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        ) : (
          <Button className="mt-3 w-full cursor-not-allowed" variant="outline" disabled>
            Not ready
          </Button>
        )}
      </div>
    </div>
  );
}

export default MaterialCardItem;
