import { db } from '@/configs/db';
import { Chapter_Notes_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { courseId, studyType } = await request.json();

  if (studyType == 'ALL') {
    const notes = await db
      .select()
      .from(Chapter_Notes_TABLE)
      .where(eq(Chapter_Notes_TABLE.courseId, courseId));

    const result = {
      notes: notes,
      flashcards: null,
      quiz: null,
      qa: null,
    };

    return NextResponse.json(result);
  } else if (studyType == 'notes') {
    const notes = await db
      .select()
      .from(Chapter_Notes_TABLE)
      .where(eq(Chapter_Notes_TABLE.courseId, courseId));
    return NextResponse.json(notes);
  }
}
