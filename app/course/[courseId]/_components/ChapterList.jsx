import React from 'react';
import { useRouter } from 'next/navigation';

function ChapterList({ course }) {
  const router = useRouter();
  const chapters = course?.courseLayout?.chapters || [];

  const handleChapterClick = (chapterIndex) => {
    router.push(`/course/${course?.courseId}/notes?chapter=${chapterIndex}`);
  };
  return (
    <div className="mt-8">
      <h2 className="font-bold text-2xl mb-6 text-gray-800">Chapters</h2>

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <div
            className="group flex gap-5 items-center p-6 border border-gray-200 bg-white shadow-sm hover:shadow-lg rounded-xl cursor-pointer transition-all duration-300 hover:border-primary/50"
            key={index}
            onClick={() => handleChapterClick(index)}
          >
            <div className="shrink-0 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <span className="text-4xl">{chapter?.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Chapter {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {chapter?.chapterTitle}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                {chapter?.chapterSummary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
