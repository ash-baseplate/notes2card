import { db } from '@/configs/db';
import { STUDY_TYPE_CONTENT_TABLE } from '@/configs/schema';
import { inngest } from '@/inngest/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { chapters, courseId, type } = await request.json();
  const PROMPT =
    type === 'Flashcards'
      ? `Generate the flashcard on topic : ${chapters} in JSON format with front back content, Maximum 15 `
      : `Generate Quiz on topic : ${chapters} with Question, Options and Correct answers  in JSON format, Maximum 15`;

  //insert to db

  const result = await db
    .insert(STUDY_TYPE_CONTENT_TABLE)
    .values({
      courseId: courseId,
      type: type,
    })
    .returning({ id: STUDY_TYPE_CONTENT_TABLE.id });

  //trigger inngest function to generate flashcards
  inngest.send({
    name: 'study/type.content.generated',
    data: {
      studyType: type,
      prompt: PROMPT,
      courseId: courseId,
      recordId: result[0].id,
    },
  });

  return NextResponse.json(result[0].id);
}
