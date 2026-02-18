'use client';
import React from 'react';

function QuestionNavigator({
  totalQuestions,
  selectedAnswers,
  questions,
  currentQuestionIndex,
  onNavigate,
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Progress</p>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAnswered = index in selectedAnswers;
          const isCorrect =
            isAnswered && selectedAnswers[index] === questions[index].correct_answer;
          const isWrong = isAnswered && !isCorrect;

          return (
            <button
              key={index}
              className={`w-full p-2.5 rounded text-xs font-medium cursor-pointer transition-colors text-left ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : isCorrect
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : isWrong
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onNavigate(index)}
            >
              <div className="flex items-center justify-between">
                <span>Q{index + 1}</span>
                {isCorrect && <span className="ml-1">✓</span>}
                {isWrong && <span className="ml-1">✕</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionNavigator;
