'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import QuizItems from './_components/QuizItems';
import QuizScore from './_components/QuizScore';

const LOTTIE_LOADING_URL =
  'https://lottie.host/8a46a4d9-1cd2-4258-b472-543a7bf7b032/k33MzDw8sJ.lottie';

function Quiz() {
  const { courseId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);

  const GetQuiz = useCallback(async () => {
    try {
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'Quiz',
      });
      // result.data contains the full object with id, courseId, type, content, status
      // The actual quiz data is in result.data.content
      setQuizData(result.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    setIsLoading(true);
    GetQuiz();
  }, [GetQuiz, courseId]);

  // Extract quiz content from the API response
  // quizData contains: { id, courseId, type, content, status }
  // content contains: { quizTitle, total_questions, questions: [...] }
  const quizContent = quizData?.content;
  const questions = quizContent?.questions || [];
  const quizTitle = quizContent?.quizTitle || 'Quiz';
  const totalQuestions = questions.length;

  const handleAnswerSelect = (selectedOption) => {
    if (showFeedback) return; // Prevent changing answer after feedback

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correct_answer;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));

    setShowFeedback(true);
    setFeedbackMessage(
      isCorrect ? 'Correct! 🎉' : `Wrong! The correct answer is: ${currentQuestion.correct_answer}`
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setFeedbackMessage('');
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowFeedback(false);
      setFeedbackMessage('');
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });
    return {
      correct: correctCount,
      total: totalQuestions || 0,
      percentage: Math.round((correctCount / (totalQuestions || 1)) * 100),
    };
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setFeedbackMessage('');
    setQuizCompleted(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-64 h-64">
              <DotLottieReact src={LOTTIE_LOADING_URL} loop autoplay />
            </div>
            <p className="text-gray-500 text-lg font-medium">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Quiz</h1>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <p className="text-red-500 text-lg font-medium">
              {error || 'No quiz content available'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Quiz</h1>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <p className="text-gray-500 text-lg font-medium">No quiz questions available</p>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return <QuizScore score={calculateScore()} onRetake={handleRetakeQuiz} quizTitle={quizTitle} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const score = calculateScore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Sticky Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{quizTitle}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          {/* Progress Bar - More Compact */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(selectedAnswers).length / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Sticky Info Panel */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-4">
              {/* Score Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                  Score
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Correct</span>
                    <span className="text-2xl font-bold text-green-600">{score.correct}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{score.total}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <span className="text-xs text-gray-600">Accuracy</span>
                    <p className="text-xl font-bold text-blue-600">{score.percentage}%</p>
                  </div>
                </div>
              </div>

              {/* Question Navigation - Compact */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  Progress
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Array.from({ length: totalQuestions }).map((_, index) => {
                    const isAnswered = index in selectedAnswers;
                    const isCorrect =
                      isAnswered && selectedAnswers[index] === questions[index].correct_answer;
                    const isWrong = isAnswered && !isCorrect;

                    return (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs font-medium cursor-pointer transition-colors ${
                          index === currentQuestionIndex
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                            : isCorrect
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : isWrong
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          setShowFeedback(false);
                          setFeedbackMessage('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>Q{index + 1}</span>
                          {isCorrect && <span className="ml-1">✓</span>}
                          {isWrong && <span className="ml-1">✕</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3 flex flex-col">
            <QuizItems
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswers[currentQuestionIndex]}
              showFeedback={showFeedback}
              feedbackMessage={feedbackMessage}
              isAnswered={currentQuestionIndex in selectedAnswers}
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer - Navigation */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 w-full">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {currentQuestionIndex + 1}/{totalQuestions}
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={!(currentQuestionIndex in selectedAnswers) && !showFeedback}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
