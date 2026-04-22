import { GenerateQuestionAnswerAiModel } from '@/configs/AiModel';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { action, question, courseTitle, chapterTitle } = await request.json();
    const prompt = getPromptForAction(action, question, courseTitle, chapterTitle);
    const response = await GenerateQuestionAnswerAiModel(prompt);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('QA API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

function getPromptForAction(action, question, courseTitle, chapterTitle) {
  const base = `Primary course title: ${courseTitle || '[course title]'}. Primary chapter title: ${chapterTitle || '[chapter title]'}. Use the course title as the main context and the chapter title as the specific topic.`;
  switch (action) {
    case 'explain_selection':
      return `${base} Explain ONLY the selected excerpt below in simple terms. Keep the explanation aligned with the course title and the chapter topic. Do not explain unrelated subject matter. Keep it concise and student-friendly with bullet points. Selected excerpt: ${question}`;
    case 'explain':
      return `${base} Explain this chapter in simple language in 5 bullet points and include 2 common mistakes students should avoid. Keep the explanation aligned with the course title and the chapter topic.`;
    case 'videos':
      return `${base} Suggest 5 YouTube video recommendations that are highly relevant ONLY to this exact course and chapter context. Use the course title and chapter title as the primary source of truth. Do not add any disclaimer about the programming language being missing or unknown. Do not mention unrelated languages/frameworks unless they are explicitly present in the course title or chapter title. For each recommendation, include: suggested title/search query, why it helps, and what to watch for.`;
    case 'check':
      return `${base} Evaluate this student answer. Keep feedback anchored to the course title and chapter topic. Return these sections: What is correct, What is missing/incorrect, Improved answer, and Next steps to study. Student answer: ${question}`;
    case 'custom':
    default:
      return `${base} Answer the student's question directly and clearly. Do not repeat or restate the question. Use concise markdown bullet points where helpful. Keep the answer aligned with the course title and chapter topic. Question: ${question}`;
  }
}
