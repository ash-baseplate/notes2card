'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

function QuizFooter({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  isAnswered,
  showFeedback,
  isLastQuestion,
}) {
  const canProceed = isAnswered || showFeedback;

  return (
    <div className="bg-white border-t border-gray-200 sticky bottom-0 z-20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 w-full">
        <div className="flex justify-between items-center">
          <Button
            size="icon"
            onClick={onPrevious}
            disabled={currentQuestionIndex === 0}
            className="h-7 px-3  bg-gray-300 text-gray-800 hover:bg-gray-400"
            variant="secondary"
          >
            ←
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              {currentQuestionIndex + 1}/{totalQuestions}
            </p>
          </div>

          <Button
            onClick={onNext}
            size="icon"
            disabled={!canProceed}
            className="h-7 px-3 text-xs bg-blue-600 text-white hover:bg-blue-700"
            variant="default"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuizFooter;
