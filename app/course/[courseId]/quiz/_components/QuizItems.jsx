'use client';
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

function QuizItems({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  selectedAnswer,
  showFeedback,
  feedbackMessage,
  isAnswered,
}) {
  const getOptionStyles = (option) => {
    const baseStyles =
      'w-full p-4 mb-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-left font-medium';
    const hoverStyles = 'hover:border-blue-400 hover:bg-blue-50';

    if (!isAnswered) {
      return `${baseStyles} ${hoverStyles} border-gray-300 bg-white text-gray-900`;
    }

    // After answer is selected
    if (option === question.correct_answer) {
      return `${baseStyles} border-green-500 bg-green-50 text-green-900`;
    }

    if (option === selectedAnswer && option !== question.correct_answer) {
      return `${baseStyles} border-red-500 bg-red-50 text-red-900`;
    }

    return `${baseStyles} border-gray-300 bg-gray-50 text-gray-600`;
  };

  const getOptionIcon = (option) => {
    if (!isAnswered) return null;

    if (option === question.correct_answer) {
      return <CheckCircle className="w-5 h-5 text-green-500 ml-2" />;
    }

    if (option === selectedAnswer && option !== question.correct_answer) {
      return <XCircle className="w-5 h-5 text-red-500 ml-2" />;
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {/* Topic Badge */}
      {question.topic && (
        <div className="inline-block mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {question.topic}
        </div>
      )}

      {/* Question */}
      <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">{question.question}</h2>

      {/* Options */}
      <div className="mb-8">
        <p className="text-sm text-gray-600 font-semibold mb-4">Select an answer:</p>
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              disabled={isAnswered}
              className={getOptionStyles(option)}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {getOptionIcon(option)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Message */}
      {showFeedback && (
        <div
          className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            feedbackMessage.includes('Correct')
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {feedbackMessage.includes('Correct') ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          )}
          <p
            className={`font-medium ${
              feedbackMessage.includes('Correct') ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {feedbackMessage}
          </p>
        </div>
      )}

      {/* Answer Explanation (Optional - you can add this from the data if available) */}
      {isAnswered && question.explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-blue-900">Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizItems;
