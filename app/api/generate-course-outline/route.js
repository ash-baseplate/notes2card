import { courseOutline } from '@/configs/AiModel';
import { db } from '@/configs/db';
import { STUDY_MATERIAL_TABLE, USER_TABLE } from '@/configs/schema';
import { inngest } from '@/inngest/client';
import { classifyAIError } from '@/lib/aiError';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { courseId, topic, studyType, difficultyLevel, createdBy } = await req.json();

    // Enforce free-tier course credit limit on the server.
    const userRows = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, createdBy));
    const isMember = !!userRows?.[0]?.isMember;

    if (!isMember) {
      const existingCourses = await db
        .select({ id: STUDY_MATERIAL_TABLE.id })
        .from(STUDY_MATERIAL_TABLE)
        .where(eq(STUDY_MATERIAL_TABLE.createBy, createdBy));

      if (existingCourses.length >= 3) {
        return NextResponse.json(
          { error: 'Free plan limit reached. You can create up to 3 courses.' },
          { status: 403 }
        );
      }
    }

    const PROMPT = `
Generate study material for: ${topic}
Type: ${studyType}
Difficulty: ${difficultyLevel}
  with summary of course, List of Chapters (max-4) along with summary and emoji icon for each chapter, Topic list in each chapter You MUST return JSON ONLY.
`;

    // OLD CODE (commented out - using new SDK version)
    // const aiResp = await courseOutline.sendMessage(PROMPT);
    // const aiResult = JSON.parse(aiResp.response.text());

    // NEW CODE (using new SDK @google/genai)
    const resultText = await courseOutline(PROMPT);
    let aiResult;
    try {
      aiResult = JSON.parse(resultText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', resultText);
      return NextResponse.json(
        { error: 'AI returned an invalid format. Please try again.' },
        { status: 502 }
      );
    }

    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId: courseId,
        courseType: studyType,
        topic: topic,
        diffcultyLevel: difficultyLevel,
        courseLayout: aiResult,
        createBy: createdBy,
      })
      .returning({ resp: STUDY_MATERIAL_TABLE });
    console.log('DB RESULT', dbResult);

    //Trigger inggest event to generate notes

    const result = await inngest.send({
      name: 'notes/generate.completed',
      data: {
        course: dbResult[0].resp,
      },
    });
    console.log('Inngest Event Result:', result);
    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    const aiError = classifyAIError(error);
    console.error('generate-course-outline failed:', error);
    return NextResponse.json(
      { error: aiError.message, code: aiError.code, retryable: aiError.retryable },
      { status: aiError.status }
    );
  }
}
