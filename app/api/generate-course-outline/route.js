import { courseOutline } from '@/configs/AiModel';
import { db } from '@/configs/db';
import { STUDY_MATERIAL_TABLE } from '@/configs/schema';
import { inngest } from '@/inngest/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { courseId, topic, studyType, difficultyLevel, createdBy } = await req.json();
  const PROMPT = `
Generate study material for: ${topic}
Type: ${studyType}
Difficulty: ${difficultyLevel}
with summary of course, List of Chapters (max-6 min-5) along with summary and emoji icon for each chapter, Topic list in each chapter You MUST return JSON ONLY.
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
    return NextResponse.json({ error: 'Invalid response from AI service' }, { status: 500 });
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
}
