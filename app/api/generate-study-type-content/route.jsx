import { db } from '@/configs/db';
import { STUDY_TYPE_CONTENT_TABLE } from '@/configs/schema';
import { inngest } from '@/inngest/client';
import { classifyAIError } from '@/lib/aiError';
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
  try {
    const { chapters, courseId, type } = await request.json();
    const normalizedType = normalizeStudyTypeKey(type);

    if (normalizedType === 'notes') {
      return NextResponse.json(
        { error: 'Notes are generated automatically with the course outline.' },
        { status: 400 }
      );
    }

    if (!normalizedType) {
      return NextResponse.json(
        { error: 'Question/Answers study type has been removed.' },
        { status: 400 }
      );
    }

    const PROMPT =
      normalizedType === 'flashcards'
        ? `Generate the flashcard on topic : ${chapters} in JSON format with front back content, Maximum 15 `
        : `Generate Quiz on topic : ${chapters} with Question, Options and Correct answers  in JSON format, Maximum 15`;

    //insert to db

    const result = await db
      .insert(STUDY_TYPE_CONTENT_TABLE)
      .values({
        courseId: courseId,
        type: normalizedType,
      })
      .returning({ id: STUDY_TYPE_CONTENT_TABLE.id });

    //trigger inngest function to generate flashcards
    await inngest.send({
      name: 'study/type.content.generated',
      data: {
        studyType: normalizedType,
        prompt: PROMPT,
        courseId: courseId,
        recordId: result[0].id,
      },
    });

    return NextResponse.json(result[0].id);
  } catch (error) {
    const aiError = classifyAIError(error);
    console.error('generate-study-type-content failed:', error);
    return NextResponse.json(
      { error: aiError.message, code: aiError.code, retryable: aiError.retryable },
      { status: aiError.status }
    );
  }
}
