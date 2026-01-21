'use client';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const router = useRouter();
  const [stepCount, setStepCount] = useState(0);
  useEffect(() => {
    GetNotes();
  }, []);
  const GetNotes = async () => {
    //fetch notes based on courseId
    const result = await axios.post('/api/study-type', {
      courseId: courseId,
      studyType: 'notes',
    });
    console.log(result?.data);
    setNotes(result?.data);
  };
  return (
    notes && (
      <div>
        <div className="flex gap-5 items-center">
          {stepCount != 0 && (
            <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount - 1)}>
              Previous
            </Button>
          )}
          {notes?.map((item, index) => (
            <div
              key={index}
              className={`w-full h-2 rounded-full 
          ${index < stepCount ? 'bg-blue-600' : 'bg-gray-200'}`}
            ></div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount + 1)}>
            Next
          </Button>
        </div>
        <div className="mt-10 ">
          <div
            dangerouslySetInnerHTML={{ __html: notes[stepCount]?.notes?.replace('```html', ' ') }}
          />
          {notes?.length == stepCount && (
            <div className="flex flex-col items-center justify-center mt-10 gap-5">
              <div className="w-80 h-80">
                <DotLottieReact
                  src="https://lottie.host/a75726b2-25fa-40ae-b1cc-257b83e4fda3/jSZhKsjy8h.lottie"
                  loop
                  autoplay
                />
              </div>
              <h2 className="text-gray-500 text-lg mt-4">You have reached the end of the notes.</h2>
              <Button onClick={() => router.back()}>Go Back to Dashboard</Button>
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default ViewNotes;
