'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

function CoursesTab({ courses }) {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const difficultyColor = {
    easy: 'bg-green-100 text-green-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  const normalizeDifficultyLabel = (raw) => {
    if (!raw) return 'Easy';
    const lower = raw.toLowerCase();
    if (lower === 'moderate') return 'Moderate';
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
        <p className="text-4xl mb-3">📚</p>
        <h3 className="text-lg font-semibold text-gray-700">No courses yet</h3>
        <p className="text-sm text-gray-400 mt-1">Create your first course to get started!</p>
        <Link href="/create">
          <Button className="mt-4">+ Create Course</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">All Courses ({courses.length})</h3>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-xs text-gray-500">
            View Dashboard →
          </Button>
        </Link>
      </div>

      <div className="divide-y">
        {courses.map((course) => (
          <Link
            key={course.courseId}
            href={`/course/${course.courseId}`}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
          >
            {/* Icon */}
            <span className="text-lg shrink-0">
              {course.courseLayout?.chapters?.[0]?.emoji || '📖'}
            </span>

            {/* Title & Type */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {course.courseLayout?.courseTitle || course.topic}
              </p>
              <p className="text-xs text-gray-400">{course.courseType}</p>
            </div>

            {/* Difficulty */}
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full hidden sm:inline ${
                difficultyColor[course.diffcultyLevel?.toLowerCase()] || difficultyColor.easy
              }`}
            >
              {normalizeDifficultyLabel(course.diffcultyLevel)}
            </span>

            {/* Status */}
            <Badge
              variant={course.status === 'Ready' ? 'default' : 'secondary'}
              className={`text-[10px] ${
                course.status === 'Ready'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-yellow-100 text-yellow-700 border-yellow-200'
              }`}
            >
              {course.status === 'Ready' ? '✅ Ready' : '⏳ Generating'}
            </Badge>

            {/* Date */}
            <span className="text-[10px] text-gray-400 hidden md:inline w-20 text-right">
              {formatDate(course.createdDate)}
            </span>

            {/* Arrow */}
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CoursesTab;
