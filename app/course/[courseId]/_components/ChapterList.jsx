import React from 'react';

function ChapterList({ course }) {
  const chapters = course?.courseLayout?.chapters || [];
  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl ">Chapters</h2>

      <div className="mt-3">
        {chapters.map((chapter, index) => (
          <div
            className="flex gap-5 items-center p-5 border shadow-md md-2 rounded-lg cursor-pointer mb-3"
            key={index}
          >
            <h2 className="p-5">=</h2>
            <div>
              <h2 className="font-medium ">{chapter?.chapterTitle}</h2>
              <p className="text-gray-400 text-sm ">{chapter?.chapterSummary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
