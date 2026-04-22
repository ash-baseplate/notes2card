import { db } from '@/configs/db';
import { Chapter_Notes_TABLE, STUDY_TYPE_CONTENT_TABLE } from '@/configs/schema';
import { and, desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const normalizeStudyTypeKey = (type) => {
  const value = type?.toLowerCase?.() || '';

  if (value === 'flashcards') return 'flashcards';
  if (value === 'quiz') return 'quiz';
  if (value === 'qa' || value === 'question/answers' || value === 'question_answers') return null;
  if (value === 'notes') return 'notes';
  return value;
};

export async function POST(request) {
  const { courseId, studyType } = await request.json();

  if (studyType == 'ALL') {
    const notes = await db
      .select()
      .from(Chapter_Notes_TABLE)
      .where(eq(Chapter_Notes_TABLE.courseId, courseId));

    const contentList = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId))
      .orderBy(desc(STUDY_TYPE_CONTENT_TABLE.id));

    const latestRecords = contentList.reduce((accumulator, item) => {
      const key = normalizeStudyTypeKey(item.type);

      if (!key) {
        return accumulator;
      }

      if (!accumulator[key]) {
        accumulator[key] = item;
      }

      return accumulator;
    }, {});

    const flashcardsRecord = latestRecords.flashcards;
    const quizRecord = latestRecords.quiz;

    const status = {
      flashcards: flashcardsRecord?.status || null,
      quiz: quizRecord?.status || null,
    };

    const failedTypes = Object.entries(status)
      .filter(([, value]) => value === 'Failed')
      .map(([key]) => key);

    const generatingTypes = Object.entries(status)
      .filter(([, value]) => value === 'Generating')
      .map(([key]) => key);

    const result = {
      notes: notes,
      flashcards: flashcardsRecord?.content,
      quiz: quizRecord?.content,
      status,
      failedTypes,
      generatingTypes,
    };

    return NextResponse.json(result);
  } else if (studyType == 'notes') {
    const notes = await db
      .select()
      .from(Chapter_Notes_TABLE)
      .where(eq(Chapter_Notes_TABLE.courseId, courseId));
    return NextResponse.json(notes);
  } else {
    const normalizedStudyType = normalizeStudyTypeKey(studyType);
    if (!normalizedStudyType) {
      return NextResponse.json(
        { error: 'Question/Answers study type has been removed.' },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
          eq(STUDY_TYPE_CONTENT_TABLE.type, normalizedStudyType)
        )
      );
    if (!result[0]) {
      return NextResponse.json({ error: 'Study content not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  }
}
