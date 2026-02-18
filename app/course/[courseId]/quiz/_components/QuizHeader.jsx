'use client';
import React from 'react';

function QuizHeader({ quizTitle, currentQuestion, totalQuestions, selectedAnswersCount }) {
  const percentage = (selectedAnswersCount / totalQuestions) * 100;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{quizTitle}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">
              Question {currentQuestion} of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizHeader;
