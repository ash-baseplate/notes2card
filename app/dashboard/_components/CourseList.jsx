'use client';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { use, useEffect } from 'react';
import { useState } from 'react';
import CourseCardItems from './CourseCardItems';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function CourseList() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [CourseList, setCourseList] = useState([]);
  useEffect(() => {
    user && GetCourseList();
  }, [user]);
  const GetCourseList = async () => {
    setLoading(true);
    const result = await axios.post('/api/courses', {
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    console.log(result);

    setCourseList(result.data.result);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mt-10 flex justify-between items-center  ">
        Your Study Material
        <Button variant="outline" className="border-primary text-primary " onClick={GetCourseList}>
          <RefreshCw />
        </Button>
      </h2>
      {!loading && CourseList?.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="w-64 h-64">
            <DotLottieReact
              src="https://lottie.host/37cad5a1-b2f5-4e24-a71d-544aa35fe3e8/FZLlXRk8So.lottie"
              loop
              autoplay
            />
          </div>
          <p className="text-gray-500 text-lg mt-4">No courses yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5">
          {loading == false
            ? CourseList?.map((course, index) => <CourseCardItems course={course} key={index} />)
            : [1, 2, 3, 4, 5, 6].map((item, index) => (
                <div
                  key={index}
                  className="animate-pulse w-full h-56 bg-slate-200 rounded-lg"
                ></div>
              ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
