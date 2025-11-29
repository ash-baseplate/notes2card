import { courseOutline } from '@/configs/AiModel';
import { db } from '@/configs/db';
import { STUDY_MATERIAL_TABLE } from '@/configs/schema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { courseId, topic, studyType, difficultyLevel, createdBy } = await req.json();
  const PROMPT = `Generate a study material for ${topic} for ${studyType} and level of difficulty will be ${difficultyLevel} with summary of course, List of Chapters along with summary for each chapter, Topic list in each chapter all result in JSON format`;

  const aiResp = await courseOutline.sendMessage(PROMPT);
  const aiResult = JSON.parse(aiResp.response.text());

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
  return NextResponse.json({ esult: dbResult[0] });
}
