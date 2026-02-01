'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChapterList from './_components/ChapterList';
import CourseIntroCard from './_components/CourseIntroCard';
import StudyMaterialSection from './_components/StudyMaterialSection';

const CourseSkeleton = () => (
  <div className="space-y-8">
    {/* Course Intro Skeleton */}
    <div className="animate-pulse bg-slate-200 h-48 rounded-lg" />

    {/* Study Material Section Skeleton */}
    <div className="animate-pulse">
      <div className="bg-slate-200 h-8 w-48 rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-slate-200 h-32 rounded-lg" />
        ))}
      </div>
    </div>

    {/* Chapter List Skeleton */}
    <div className="animate-pulse">
      <div className="bg-slate-200 h-8 w-32 rounded mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-slate-200 h-24 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const result = await axios.get(`/api/courses?courseId=${courseId}`);
        setCourse(result.data.result);
      } catch (error) {
        console.error('Error fetching course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return <CourseSkeleton />;
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-lg">Course not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CourseIntroCard course={course} />
      <StudyMaterialSection courseId={courseId} course={course} />
      <ChapterList course={course} />
    </div>
  );
}

export default Course;
