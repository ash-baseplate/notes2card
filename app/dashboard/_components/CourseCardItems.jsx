import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function CourseCardItems({ course, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete('/api/delete-course', {
        data: { courseId: course?.courseId },
      });
      toast.success('Course deleted successfully');
      // Call the onDelete callback to refresh the list
      if (onDelete) {
        onDelete(course?.courseId);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 bg-white hover:border-primary/50">
      <div>
        <div className="flex justify-between items-center">
          <Image src={'/knowledge.png'} alt={'other'} width={50} height={50} />
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete course"
            >
              {isDeleting ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>
            <h2 className="text-[10px] p-1 px-2 rounded-full bg-primary text-white">
              {formatDate(course?.createdDate)}
            </h2>
          </div>
        </div>
        <h2 className="mt-3 font-medium text-lg">{course?.courseLayout?.courseTitle}</h2>
        <p className="text-sm line-clamp-2 text-grey-500 mt-2">
          {course?.courseLayout?.courseSummary}
        </p>
        <div className="flex justify-end mt-3">
          {course?.status == 'Generating' ? (
            <Button variant="secondary" disabled className="flex gap-2 items-center">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generating...
            </Button>
          ) : (
            <Link href={'course/' + course?.courseId}>
              <Button disabled={isDeleting}>View</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCardItems;
