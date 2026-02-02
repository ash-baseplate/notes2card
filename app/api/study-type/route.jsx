import { db } from '@/configs/db';
import { Chapter_Notes_TABLE, STUDY_TYPE_CONTENT_TABLE } from '@/configs/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));

    const result = {
      notes: notes,
      flashcards: contentList?.find((item) => item.type === 'Flashcards')?.content,
      quiz: contentList?.find((item) => item.type === 'Quiz')?.content,
      qa: contentList?.find((item) => item.type === 'Question/Answers')?.content,
    };

    return NextResponse.json(result);
  } else if (studyType == 'notes') {
    const notes = await db
      .select()
      .from(Chapter_Notes_TABLE)
      .where(eq(Chapter_Notes_TABLE.courseId, courseId));
    return NextResponse.json(notes);
  } else {
    const result = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
          eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)
        )
      );
    return NextResponse.json(result[0]);
  }
}
