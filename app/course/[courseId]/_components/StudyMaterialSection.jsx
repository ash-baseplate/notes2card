import React, { useEffect, useState } from 'react';
import MaterialCardItem from './MaterialCardItem';
import axios from 'axios';
import { type } from 'os';
import Link from 'next/link';

function StudyMaterialSection({ courseId }) {
  const [studyTypeContent, setStudyTypeContent] = useState();
  const MaterialList = [
    {
      name: 'Notes/Chapters',
      desc: 'All the notes and chapters related to this course',
      icon: '/notes.png',
      path: '/notes',
      type: 'notes',
    },
    {
      name: 'Flashcards',
      desc: 'Flashcards to help you memorize key concepts',
      icon: '/flashcard.png',
      path: '/flashcards',
      type: 'flashcards',
    },
    {
      name: 'Quiz',
      desc: 'Test your knowledge with quizzes',
      icon: '/quiz.png',
      path: '/quiz',
      type: 'quiz',
    },
    {
      name: 'Question/Answers',
      desc: 'Practice questions and answers ',
      icon: '/qa.png',
      path: '/qa',
      type: 'qa',
    },
  ];

  useEffect(() => {
    GetStudyMaterial();
  }, []);
  const GetStudyMaterial = async () => {
    //fetch study material based on courseId
    const result = await axios.post('/api/study-type', {
      courseId: courseId,
      studyType: 'ALL',
    });
    console.log(result?.data);
    setStudyTypeContent(result.data);
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl ">Study Materials</h2>
      <div className="grid grid-col-2 md:grid-cols-4 gap-5 mt-3">
        {MaterialList.map((item, index) => (
          <Link key={index} href={'/course/' + courseId + item.path}>
            <MaterialCardItem key={index} item={item} studyTypeContent={studyTypeContent} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
