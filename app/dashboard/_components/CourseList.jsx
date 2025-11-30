'use client';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { use, useEffect } from 'react';
import { useState } from 'react';
import CourseCardItems from './CourseCardItems';

function CourseList() {
  const { user } = useUser();

  const [CourseList, setCourseList] = useState([]);
  useEffect(() => {
    user && GetCourseList();
  }, [user]);
  const GetCourseList = async () => {
    const result = await axios.post('/api/courses', {
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    console.log(result);

    setCourseList(result.data.result);
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mt-10">Your Study Material</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5">
        {CourseList?.map((course, index) => (
          <CourseCardItems course={course} key={index} />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
