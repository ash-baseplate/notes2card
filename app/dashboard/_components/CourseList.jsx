'use client';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useContext, useEffect, useCallback, useRef } from 'react';
import { useState } from 'react';
import CourseCardItems from './CourseCardItems';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from 'next/link';
import { CourseCountContext } from '@/app/_context/CourseCountContext';

function CourseList() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [CourseList, setCourseList] = useState([]);
  const { courseCount, setCourseCount } = useContext(CourseCountContext);
  const pollingRef = useRef(null);

  useEffect(() => {
    user && GetCourseList();
  }, [user]);

  // Polling effect for auto-refresh when courses are generating
  useEffect(() => {
    const hasGeneratingCourse = CourseList?.some((course) => course?.status === 'Generating');

    if (hasGeneratingCourse && !pollingRef.current) {
      pollingRef.current = setInterval(() => {
        GetCourseList();
      }, 10000);
    } else if (!hasGeneratingCourse && pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [CourseList]);

  const GetCourseList = async () => {
    setLoading(true);
    const result = await axios.post('/api/courses', {
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    console.log(result);

    setCourseList(result.data.result);
    setLoading(false);
    setCourseCount(result.data.result?.length);
  };

  const handleCourseDelete = useCallback(
    (deletedCourseId) => {
      // Optimistically remove the course from the list
      setCourseList((prevList) => prevList.filter((course) => course.courseId !== deletedCourseId));
      setCourseCount((prevCount) => prevCount - 1);
      // Refresh the list to ensure consistency with database
      setTimeout(() => {
        GetCourseList();
      }, 1000);
    },
    [setCourseCount]
  );

  return (
    <div>
      <h2 className="font-bold text-xl md:text-2xl mt-6 md:mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        Your Study Material
        <div className="flex gap-2 items-center">
          <Link href={courseCount >= 5 ? "#" : "/create"}>
            <Button disabled={courseCount >= 5}>+ Create New</Button>
          </Link>
          <Button variant="outline" className="border-primary text-primary" onClick={GetCourseList}>
            <RefreshCw />
          </Button>
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-2 gap-3 md:gap-5">
          {loading === false
            ? CourseList?.map((course, index) => (
                <CourseCardItems
                  course={course}
                  key={course?.courseId || index}
                  onDelete={handleCourseDelete}
                />
              ))
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
