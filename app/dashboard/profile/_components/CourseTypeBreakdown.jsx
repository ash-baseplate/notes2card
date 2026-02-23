'use client';

const COURSE_TYPES = ['Exam', 'Practice', 'Job Interview', 'Coding Prep', 'Other'];

const typeColors = {
  Exam: 'bg-indigo-500',
  Practice: 'bg-blue-500',
  'Job Interview': 'bg-purple-500',
  'Coding Prep': 'bg-cyan-500',
  Other: 'bg-gray-400',
};

function CourseTypeBreakdown({ courses }) {
  // Count courses by type
  const grouped = {};
  courses.forEach((c) => {
    const type = COURSE_TYPES.includes(c.courseType) ? c.courseType : 'Other';
    grouped[type] = (grouped[type] || 0) + 1;
  });

  // Always show all types, even if zero
  const entries = COURSE_TYPES.map((type) => [type, grouped[type] || 0]);
  const max = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Course Types</h3>
      <div className="space-y-3">
        {entries.map(([type, count]) => (
          <div key={type}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">{type}</span>
              <span className="text-xs font-bold text-gray-900">{count}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${typeColors[type] || typeColors.Other}`}
                style={{ width: count === 0 ? '0%' : `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && <p className="text-sm text-gray-400 mt-4">No courses yet</p>}
    </div>
  );
}

export default CourseTypeBreakdown;
