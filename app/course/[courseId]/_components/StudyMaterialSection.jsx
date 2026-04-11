import React, { useEffect, useRef, useState } from 'react';
import MaterialCardItem from './MaterialCardItem';
import axios from 'axios';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

const MATERIAL_LIST = [
  {
    name: 'Notes/Chapters',
    desc: 'All the notes and chapters related to this course',
    icon: '/notes.png',
    path: '/notes',
    type: 'notes',
  },
  {
    name: 'Flashcards',
    desc: 'Flashcards to help you memorize key concepts',
    icon: '/flashcard.png',
    path: '/flashcards',
    type: 'flashcards',
  },
  {
    name: 'Quiz',
    desc: 'Test your knowledge with quizzes',
    icon: '/quiz.png',
    path: '/quiz',
    type: 'quiz',
  },
  {
    name: 'Question/Answers',
    desc: 'Practice questions and answers ',
    icon: '/qa.png',
    path: '',
    type: 'qa',
  },
];

function StudyMaterialSection({ courseId, course }) {
  const [studyTypeContent, setStudyTypeContent] = useState();
  const [pendingTypes, setPendingTypes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);
  const hasShownPollingLimitToast = useRef(false);

  useEffect(() => {
    GetStudyMaterial();
  }, []);

  const GetStudyMaterial = async (options = {}) => {
    try {
      if (options.requestedType) {
        setPendingTypes((prev) => ({ ...prev, [options.requestedType]: true }));
        setPollAttempts(0);
        hasShownPollingLimitToast.current = false;
        return;
      }

      setRefreshing(true);
      const result = await axios.post('/api/study-type', {
        courseId,
        studyType: 'ALL',
      });
      setStudyTypeContent(result.data);
      const status = result.data?.status || {};

      const nextPendingTypes = {};
      const canceledTypeLabels = [];

      Object.keys(pendingTypes).forEach((typeKey) => {
        const isReady = Boolean(result.data?.[typeKey]);
        const typeStatus = status[typeKey];

        if (isReady || typeStatus === 'Ready') {
          return;
        }

        if (typeStatus === 'Generating') {
          nextPendingTypes[typeKey] = true;
          return;
        }

        canceledTypeLabels.push(typeKey);
      });

      if (canceledTypeLabels.length > 0) {
        toast.error(
          `Generation canceled for: ${canceledTypeLabels.join(', ')}. The pending record was removed.`
        );
      }

      setPendingTypes(nextPendingTypes);

      if (Object.keys(nextPendingTypes).length === 0) {
        setPollAttempts(0);
        hasShownPollingLimitToast.current = false;
      }
    } catch (error) {
      console.error('Failed to fetch study materials:', error);
      toast.error('Failed to refresh study materials. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const hasPending = Object.keys(pendingTypes).length > 0;

    if (!hasPending) {
      return;
    }

    if (pollAttempts >= 5) {
      if (!hasShownPollingLimitToast.current) {
        toast.error(
          'Generation is taking longer than expected. Please use refresh to check again.'
        );
        hasShownPollingLimitToast.current = true;
      }
      return;
    }

    const timer = setTimeout(() => {
      setPollAttempts((prev) => prev + 1);
      GetStudyMaterial();
    }, 15000);

    return () => clearTimeout(timer);
  }, [pendingTypes, pollAttempts]);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-xl ">Study Materials</h2>
        <button
          type="button"
          onClick={() => GetStudyMaterial()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCcw className={refreshing ? 'animate-spin' : ''} size={14} />
        </button>
      </div>
      <div className="grid grid-col-2 md:grid-cols-4 gap-5 mt-3">
        {MATERIAL_LIST.map((item) => (
          <MaterialCardItem
            key={item.type}
            item={item}
            studyTypeContent={studyTypeContent}
            isPending={Boolean(pendingTypes[item.type])}
            canGenerate={item.type !== 'notes'}
            course={course}
            refreshData={GetStudyMaterial}
          />
        ))}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
