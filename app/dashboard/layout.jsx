'use client';
import React, { useState } from 'react';
import DashboardHeader from './_components/DashboardHeader';
import { CourseCountContext } from '../_context/CourseCountContext';

function DashboardLayout({ children }) {
  const [courseCount, setCourseCount] = useState(0);
  return (
    <CourseCountContext.Provider value={{ courseCount, setCourseCount }}>
      <div>
        <DashboardHeader />
        <div className="p-4 md:p-10 mx-auto max-w-7xl">{children}</div>
      </div>
    </CourseCountContext.Provider>
  );
}

export default DashboardLayout;
