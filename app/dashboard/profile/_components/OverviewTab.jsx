'use client';

import StatCard from './StatCard';
import CourseTypeBreakdown from './CourseTypeBreakdown';
import DifficultyChart from './DifficultyChart';

function OverviewTab({ courses, isMember }) {
  const total = courses.length;
  const ready = courses.filter((c) => c.status === 'Ready').length;
  const generating = courses.filter((c) => c.status === 'Generating').length;
  const credits = isMember ? 'Unlimited' : `${Math.max(5 - total, 0)} / 5`;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📚" label="Total Courses" value={total} />
        <StatCard icon="✅" label="Ready" value={ready} />
        <StatCard icon="⏳" label="Generating" value={generating} />
        <StatCard icon="🎯" label="Credits" value={credits} />
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CourseTypeBreakdown courses={courses} />
        <DifficultyChart courses={courses} />
      </div>
    </div>
  );
}

export default OverviewTab;
