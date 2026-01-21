'use client';
import DashboardHeader from '@/app/dashboard/_components/DashboardHeader';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import CourseIntroCard from './_components/CourseIntroCard';
import StudyMaterialSection from './_components/StudyMaterialSection';
import ChapterList from './_components/ChapterList';

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  useEffect(() => {
    GetCourse();
  }, []);
  const GetCourse = async () => {
    const result = await axios.get('/api/courses?courseId=' + courseId);
    console.log(result);
    setCourse(result.data.result);
  };
  return (
    <div>
      <div>
        {/*course intro */}
        <CourseIntroCard course={course} />
        {/*course content */}
        <StudyMaterialSection courseId={courseId} />
        {/*chapter list*/}
        <ChapterList course={course} />
      </div>
    </div>
  );
}

export default Course;
