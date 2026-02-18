'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import QuizScore from './_components/QuizScore';
import QuizHeader from './_components/QuizHeader';
import QuizFooter from './_components/QuizFooter';
import ScoreCard from './_components/ScoreCard';
import QuestionNavigator from './_components/QuestionNavigator';
import MainSection from './_components/MainSection';
import LoadingState from './_components/LoadingState';
import ErrorState from './_components/ErrorState';
import EmptyState from './_components/EmptyState';

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

  const quizContent = quizData?.content;
  const questions = quizContent?.questions || [];
  const quizTitle = quizContent?.quizTitle || 'Quiz';
  const totalQuestions = questions.length;

  const handleAnswerSelect = (selectedOption) => {
    if (showFeedback) return;

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

  const handleNavigateQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowFeedback(false);
    setFeedbackMessage('');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !quizData) {
    return <ErrorState error={error} />;
  }

  if (!questions || questions.length === 0) {
    return <EmptyState />;
  }

  if (quizCompleted) {
    return <QuizScore score={calculateScore()} onRetake={handleRetakeQuiz} quizTitle={quizTitle} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const score = calculateScore();
  const isAnswered = currentQuestionIndex in selectedAnswers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <QuizHeader
        quizTitle={quizTitle}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        selectedAnswersCount={Object.keys(selectedAnswers).length}
      />

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-4">
              <ScoreCard
                correct={score.correct}
                total={score.total}
                percentage={score.percentage}
              />
              <QuestionNavigator
                totalQuestions={totalQuestions}
                selectedAnswers={selectedAnswers}
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                onNavigate={handleNavigateQuestion}
              />
              <QuizFooter
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isAnswered={isAnswered}
                showFeedback={showFeedback}
                isLastQuestion={currentQuestionIndex === totalQuestions - 1}
              />
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3 flex flex-col">
            <MainSection
              question={currentQuestion}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswers[currentQuestionIndex]}
              showFeedback={showFeedback}
              feedbackMessage={feedbackMessage}
              isAnswered={isAnswered}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
