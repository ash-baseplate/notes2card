'use client';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { use, useEffect } from 'react';
import { useState } from 'react';
import CourseCardItems from './CourseCardItems';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

function CourseList() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
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
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5">
        {loading == false
          ? CourseList?.map((course, index) => <CourseCardItems course={course} key={index} />)
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index} className="animate-pulse w-full h-56 bg-slate-200 rounded-lg"></div>
            ))}
      </div>
    </div>
  );
}

export default CourseList;
