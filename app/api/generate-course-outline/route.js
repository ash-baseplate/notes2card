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
with summary of course, List of Chapters along with summary for each chapter, Topic list in each chapter

You MUST return JSON ONLY in the following exact structure:

{
  "courseTitle": "",
  "courseSummary": "",
  "chapters": [
    {
      "chapterTitle": "",
      "chapterSummary": "",
      "topics": []
    }
  ]
}

Rules:
- Use EXACTLY these keys.
- DO NOT add any extra keys.
- DO NOT rename any key.
- DO NOT number chapters.
- DO NOT include markdown.
- DO NOT wrap in backticks.
- ALWAYS follow this structure even for non-technical subjects like fashion, cooking, languages, soft skills, etc.
`;
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
