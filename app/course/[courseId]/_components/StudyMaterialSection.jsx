import path from 'path';
import React from 'react';
import MaterialCardItem from './MaterialCardItem';
import { Item } from '@radix-ui/react-select';

function StudyMaterialSection() {
  const MaterialList = [
    {
      name: 'Notes/Chapters',
      desc: 'All the notes and chapters related to this course',
      icon: '/notes.png',
      path: '/notes',
    },
    {
      name: 'Flashcards',
      desc: 'Flashcards to help you memorize key concepts',
      icon: '/flashcard.png',
      path: '/flashcards',
    },
    {
      name: 'Quiz',
      desc: 'Test your knowledge with quizzes',
      icon: '/quiz.png',
      path: '/quiz',
    },
    {
      name: 'Question/Answers',
      desc: 'Practice questions and answers for better understanding',
      icon: '/qa.png',
      path: '/qa',
    },
  ];
  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl ">Study Materials</h2>
      <div className="grid grid-col-2 md:grid-cols-4 gap-5 mt-3">
        {MaterialList.map((item, index) => (
          <MaterialCardItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
