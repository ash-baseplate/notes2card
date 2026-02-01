const { GoogleGenerativeAI } = require('@google/generative-ai');

const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apikey);
const model = ai.getGenerativeModel({
  model: 'gemini-3-flash-preview',
});
const generationConfig = {
  temperature: 0.4,
  maxOutputTokens: 8192,
  topP: 0.95,
  topK: 40,
  responseMimeType: 'application/json',
};
const generationConfig2 = {
  temperature: 0.4,
  maxOutputTokens: 8192,
  topP: 0.95,
  topK: 40,
  responseMimeType: 'text/plain',
};

export const courseOutline = model.startChat({
  generationConfig,
  history: [],
});

export const chapterNotesGenerator = model.startChat({
  generationConfig2,
  history: [],
});

export const GenerateStudyTypeContentAiModel = model.startChat({
  generationConfig,
  history: [],
});
