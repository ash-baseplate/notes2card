import { db } from '@/configs/db';
import { inngest } from './client';
import {
  Chapter_Notes_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
  USER_TABLE,
} from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { chapterNotesGenerator, GenerateStudyTypeContentAiModel } from '@/configs/AiModel';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s');
    return { message: `Hello ${event.data.email}!` };
  }
);

export const CreatNewUser = inngest.createFunction(
  { id: 'create-user' },
  { event: 'user/new.created' },

  async ({ event, step }) => {
    const { user } = event.data;
    // console.log("USER DATA:", user); // Debug incoming payload

    // Get event data
    const result = await step.run('create-user-if-not-in-db', async () => {
      // Check if user exists
      const result = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));
      console.log(result);

      if (result?.length == 0) {
        //if not, create user
        const userResp = await db
          .insert(USER_TABLE)
          .values({
            userName: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
          })
          .returning({ id: USER_TABLE.id });
        return userResp;
      }
      return result;
    });
    await step.sleep('wait-a-moment', '1s');
    return 'User creation process completed';
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: 'generate-notes' },
  { event: 'notes/generate.completed' },
  async ({ event, step }) => {
    const { course } = event.data;
    // Logic to process generated notes

    const notesResult = await step.run('process-generated-notes', async () => {
      // Example: Log the notes data
      const Chapters = course?.courseLayout?.chapters;

      if (!Chapters || !Array.isArray(Chapters)) {
        console.error('No chapters found in course layout:', course);
        return 'No chapters to process';
      }

      let index = 0;
      Chapters.forEach(async (chapter) => {
        const PROMPT = `Generate exam material detail content for each chapter.

Requirements:
- Make sure to include all topic points in the content
- Give content in HTML format (Do not add HTML, Head, Body, or title tags)
- Structure the content with proper headings, sections, lists, and formatting
- Include detailed explanations for each topic
- Use semantic HTML elements like <div>, <section>, <h1>-<h6>, <ul>, <li>, <p>, <strong>, <code>, etc.

Chapter Data: ${JSON.stringify(chapter)}`;
        const result = await chapterNotesGenerator.sendMessage(PROMPT);
        const aiResp = result.response.text();
        // Save notes to DB
        await db.insert(Chapter_Notes_TABLE).values({
          courseId: course?.courseId,
          chapterId: index,
          notes: aiResp,
        });
        index++;
      });

      return 'Notes generation process completed';
    });

    const updateCourseStatus = await step.run('update-course-status-to-ready', async () => {
      const result = await db
        .update(STUDY_MATERIAL_TABLE)
        .set({ status: 'Ready' })
        .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
      return 'Successfully updated course status to Ready';
    });
  }
);

export const GenerateStudyTypeContent = inngest.createFunction(
  { id: 'generate-study-type-content' },
  { event: 'study/type.content.generated' },
  async ({ event, step }) => {
    const { studyType, prompt, courseId, recordId } = event.data;
    // Logic to process generated study type content

    const FlashcardAiResult = await step.run('Generating-flashcard', async () => {
      // Store the generated content in the database
      const result = await GenerateStudyTypeContentAiModel.sendMessage(prompt);
      const aiResp = JSON.parse(result.response.text());
      return aiResp;
    });

    const DbResult = await step.run('store-study-type-content-in-db', async () => {
      // Store the generated content in the database
      const result = await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({
          content: FlashcardAiResult,
          status: 'Ready',
        })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
    });

    return 'Study type content generation process completed';
  }
);
