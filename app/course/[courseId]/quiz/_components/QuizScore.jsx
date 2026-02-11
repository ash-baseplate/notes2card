'use client';
import React from 'react';
import { Award, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function QuizScore({ score, onRetake, quizTitle }) {
  const { courseId } = useParams();

  const getScoreMessage = (percentage) => {
    if (percentage === 100) return 'Perfect Score! Outstanding! 🏆';
    if (percentage >= 80) return 'Excellent! Great job! 🎉';
    if (percentage >= 60) return 'Good! Keep practicing! 💪';
    if (percentage >= 40) return 'Not bad! Review and try again! 📚';
    return "Keep learning! You'll improve! 🌟";
  };

  const getScoreColor = (percentage) => {
    if (percentage === 100) return 'from-purple-500 to-pink-500';
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-blue-500 to-cyan-500';
    if (percentage >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Complete! 🎊</h1>
          <p className="text-gray-600 text-base mt-2">{quizTitle}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Score Card */}
        <div
          className={`bg-gradient-to-br ${getScoreColor(score.percentage)} rounded-2xl shadow-xl p-12 text-white text-center mb-8`}
        >
          <div className="flex justify-center mb-6">
            <Award className="w-16 h-16" />
          </div>

          <h2 className="text-5xl font-bold mb-3">{score.percentage}%</h2>

          <p className="text-xl font-semibold mb-6">{getScoreMessage(score.percentage)}</p>

          <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-lg font-medium">
              You got <span className="text-2xl font-bold">{score.correct}</span> out of{' '}
              <span className="text-2xl font-bold">{score.total}</span> questions correct
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Correct Answers</p>
            <p className="text-3xl font-bold text-green-600">{score.correct}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Incorrect Answers</p>
            <p className="text-3xl font-bold text-red-600">{score.total - score.correct}</p>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>

          {score.percentage === 100 ? (
            <div className="space-y-2 text-gray-700">
              <p>✓ You've mastered this topic!</p>
              <p>✓ Consider challenging yourself with harder quizzes.</p>
            </div>
          ) : score.percentage >= 80 ? (
            <div className="space-y-2 text-gray-700">
              <p>✓ You have a strong understanding of the material.</p>
              <p>✓ Review the questions you missed to solidify your knowledge.</p>
            </div>
          ) : score.percentage >= 60 ? (
            <div className="space-y-2 text-gray-700">
              <p>✓ You understand the core concepts.</p>
              <p>✓ Spend more time on the topics you struggled with.</p>
              <p>✓ Consider retaking the quiz to improve your score.</p>
            </div>
          ) : (
            <div className="space-y-2 text-gray-700">
              <p>✓ It's okay! Learning takes time and practice.</p>
              <p>✓ Review the course notes and materials carefully.</p>
              <p>✓ Try again to see how much you've improved!</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </button>

          <Link
            href={`/course/${courseId}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
          >
            <Home className="w-5 h-5" />
            Back to Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QuizScore;
