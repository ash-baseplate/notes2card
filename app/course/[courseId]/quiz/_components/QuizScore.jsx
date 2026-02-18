'use client';
import React from 'react';
import { Award, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-4xl font-bold text-gray-900">Quiz Complete! 🎊</h1>
          <p className="text-gray-600 text-lg mt-1">{quizTitle}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Score Card */}
          <div
            className={`lg:col-span-1 bg-gradient-to-br ${getScoreColor(score.percentage)} rounded-2xl shadow-xl p-12 text-white text-center`}
          >
            <div className="flex justify-center mb-6">
              <Award className="w-16 h-16" />
            </div>

            <h2 className="text-6xl font-bold mb-2">{score.percentage}%</h2>

            <p className="text-2xl font-semibold mb-4">{getScoreMessage(score.percentage)}</p>
          </div>

          <div className="lg:col-span-2 space-y-5">
            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-base font-medium mb-1">Correct Answers</p>
                <p className="text-4xl font-bold text-green-600">{score.correct}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <p className="text-gray-600 text-base font-medium mb-1">Incorrect Answers</p>
                <p className="text-4xl font-bold text-red-600">{score.total - score.correct}</p>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Insights</h3>

              {score.percentage === 100 ? (
                <div className="space-y-1 text-lg text-gray-700">
                  <p>✓ You've mastered this topic!</p>
                  <p>✓ Consider challenging yourself with harder quizzes.</p>
                </div>
              ) : score.percentage >= 80 ? (
                <div className="space-y-1 text-lg text-gray-700">
                  <p>✓ You have a strong understanding of the material.</p>
                  <p>✓ Review the questions you missed to solidify your knowledge.</p>
                </div>
              ) : score.percentage >= 60 ? (
                <div className="space-y-1 text-lg text-gray-700">
                  <p>✓ You understand the core concepts.</p>
                  <p>✓ Spend more time on the topics you struggled with.</p>
                  <p>✓ Consider retaking the quiz to improve your score.</p>
                </div>
              ) : (
                <div className="space-y-1 text-lg text-gray-700">
                  <p>✓ It's okay! Learning takes time and practice.</p>
                  <p>✓ Review the course notes and materials carefully.</p>
                  <p>✓ Try again to see how much you've improved!</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onRetake}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors shadow-md text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </Button>

              <Button
                asChild
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded font-medium hover:bg-gray-700 transition-colors shadow-md text-sm"
              >
                <Link href={`/course/${courseId}`}>
                  <Home className="w-4 h-4" />
                  Back to Course
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizScore;
