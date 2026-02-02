'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import FlashCardsItems from './_components/FlashCardsItems';

const LOTTIE_LOADING_URL =
  'https://lottie.host/8a46a4d9-1cd2-4258-b472-543a7bf7b032/k33MzDw8sJ.lottie';

function Flashcards() {
  const { courseId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const GetFlashCards = useCallback(async () => {
    try {
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'Flashcards',
      });
      setFlashcards(result.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    setIsLoading(true);
    GetFlashCards();
  }, [GetFlashCards, courseId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Flashcards</h1>
              <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
                Master your course material through interactive study cards—flip, learn, and retain
                key concepts efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-64 h-64">
              <DotLottieReact src={LOTTIE_LOADING_URL} loop autoplay />
            </div>
            <p className="text-gray-500 text-lg font-medium">Loading flashcards...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <FlashCardsItems flashcards={flashcards} flipDirection="horizontal" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Flashcards;
