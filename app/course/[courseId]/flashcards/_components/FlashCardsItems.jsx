'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProgressBar from './ProgressBar';

/**
 * CardFlip Component - A React 19 compatible card flip animation component
 * Similar to react-card-flip but optimized for React 19
 */
function CardFlip({
  isFlipped = false,
  flipSpeedBackToFront = 0.6,
  flipSpeedFrontToBack = 0.6,
  flipDirection = 'horizontal',
  infinite = false,
  containerStyle = {},
  containerClassName = '',
  cardStyles = { front: {}, back: {} },
  cardZIndex = 'auto',
  children,
}) {
  const [isFlippedState, setFlipped] = useState(isFlipped);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isFlipped !== isFlippedState) {
      setFlipped(isFlipped);
      setRotation((prev) => prev + 180);
    }
  }, [isFlipped, isFlippedState]);

  const getContainerClassName = useMemo(() => {
    let className = 'react-card-flip';
    if (containerClassName) {
      className += ` ${containerClassName}`;
    }
    return className;
  }, [containerClassName]);

  const getComponent = (key) => {
    if (!children || (Array.isArray(children) && children.length !== 2)) {
      throw new Error('CardFlip component requires exactly 2 children (front and back)');
    }
    return Array.isArray(children) ? children[key] : null;
  };

  const { back = {}, front = {} } = cardStyles;

  const frontRotateY = `rotateY(${infinite ? rotation : isFlipped ? 180 : 0}deg)`;
  const backRotateY = `rotateY(${infinite ? rotation + 180 : isFlipped ? 0 : -180}deg)`;
  const frontRotateX = `rotateX(${infinite ? rotation : isFlipped ? 180 : 0}deg)`;
  const backRotateX = `rotateX(${infinite ? rotation + 180 : isFlipped ? 0 : -180}deg)`;

  const styles = {
    back: {
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      height: '100%',
      left: '0',
      position: isFlipped ? 'relative' : 'absolute',
      top: '0',
      transform: flipDirection === 'horizontal' ? backRotateY : backRotateX,
      transformStyle: 'preserve-3d',
      transition: `${flipSpeedFrontToBack}s`,
      width: '100%',
      zIndex: isFlipped ? '2' : '1',
      ...back,
    },
    container: {
      zIndex: `${cardZIndex}`,
    },
    flipper: {
      height: '100%',
      perspective: '1000px',
      position: 'relative',
      width: '100%',
    },
    front: {
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      height: '100%',
      left: '0',
      position: isFlipped ? 'absolute' : 'relative',
      top: '0',
      transform: flipDirection === 'horizontal' ? frontRotateY : frontRotateX,
      transformStyle: 'preserve-3d',
      transition: `${flipSpeedBackToFront}s`,
      width: '100%',
      zIndex: '2',
      ...front,
    },
  };

  return (
    <div className={getContainerClassName} style={{ ...styles.container, ...containerStyle }}>
      <div className="react-card-flipper" style={styles.flipper}>
        <div className="react-card-front" style={styles.front}>
          {getComponent(0)}
        </div>
        <div className="react-card-back" style={styles.back}>
          {getComponent(1)}
        </div>
      </div>
    </div>
  );
}

/**
 * FlashCardsItems Component - Complete flashcard viewer with carousel navigation
 * @param {Array} flashcards - Array of flashcard objects with 'front' and 'back' properties
 * @param {string} flipDirection - Direction of flip animation ('horizontal' or 'vertical')
 */
function FlashCardsItems({ flashcards = [], flipDirection = 'horizontal' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [api, setApi] = React.useState();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSlide = () => {
      setIsFlipped(false);
    };

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on('select', handleSelect);
    api.on('scroll', handleSlide);

    return () => {
      api.off('select', handleSelect);
      api.off('scroll', handleSlide);
    };
  }, [api]);

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <ProgressBar currentIndex={currentIndex} totalCards={flashcards?.content?.length || 0} />

      {/* Carousel */}
      <Carousel setApi={setApi} className="w-full max-w-2xl">
        <CarouselContent>
          {flashcards?.content?.map((card, index) => (
            <CarouselItem key={index}>
              <div className="flex items-center justify-center p-4">
                <CardFlip
                  isFlipped={isFlipped}
                  flipDirection={flipDirection}
                  flipSpeedBackToFront={0.6}
                  flipSpeedFrontToBack={0.6}
                  containerStyle={{
                    width: '100%',
                    maxWidth: '600px',
                    height: '400px',
                  }}
                >
                  {/* Front of Card - Question */}
                  <div
                    className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl p-10 cursor-pointer flex flex-col items-center justify-center h-full transition-all duration-300 ease-out hover:border-gray-300 group"
                    onClick={handleFlip}
                  >
                    <div className="text-xs text-gray-400 font-bold tracking-widest mb-6 uppercase">
                      Question
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center leading-relaxed mb-6 flex-1 flex items-center">
                      {card?.front || 'Click to see answer'}
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      <span>Click to reveal answer</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 5l7 7m0 0l-7 7m7-7H6"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Back of Card - Answer */}
                  <div
                    className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-md hover:shadow-xl p-10 cursor-pointer flex flex-col items-center justify-center h-full transition-all duration-300 ease-out hover:from-blue-500 hover:to-blue-600 group"
                    onClick={handleFlip}
                  >
                    <div className="text-xs text-blue-200 font-bold tracking-widest mb-6 uppercase">
                      Answer
                    </div>
                    <p className="text-2xl font-semibold text-left leading-relaxed mb-6 flex-1 flex items-center">
                      {card?.back || 'Answer'}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-blue-100 group-hover:text-white transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span>Click to hide answer</span>
                    </div>
                  </div>
                </CardFlip>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}

export { CardFlip };
export default FlashCardsItems;
