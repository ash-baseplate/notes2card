const { GoogleGenerativeAI } = require('@google/generative-ai');

const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apikey);
const model = ai.getGenerativeModel({
  model: 'gemini-2.0-flash',
});
const generationConfig = {
  temperature: 1,
  maxOutputTokens: 8192,
  topP: 0.95,
  topK: 40,
  responseMimeType: 'application/json',
};

export const courseOutline = model.startChat({
  generationConfig,
  history: [
    // {
    //   role: 'user',
    //   parts: [
    //     {
    //       text: `Generate a study material for Python for Exam and level of difficulty will be Medium with summary of course, List of Chapters along with summary for each chapter, Topic list in each chapter all result in JSON format`,
    //     },
    //   ],
    // },
    // {
    //   role: 'model',
    //   parts: [
    //     {
    //       text: '```json\n{\n  "courseTitle": "Intermediate Python Programming",\n  "courseSummary": "This course builds upon basic Python knowledge, covering object-oriented programming, data structures, file handling, and essential libraries. It\'s designed for those aiming to develop more complex applications and prepare for intermediate-level Python certifications or roles.",\n  "chapters": [\n    {\n      "chapterTitle": "Object-Oriented Programming (OOP)",\n      "chapterSummary": "This chapter introduces the principles of OOP, including classes, objects, inheritance, and polymorphism. It focuses on how to structure Python code using OOP concepts for better organization and reusability.",\n      "topics": [\n        "Classes and Objects",\n        "Attributes and Methods",\n        "The __init__ method",\n        "Inheritance (Single and Multiple)",\n        "Polymorphism",\n        "Encapsulation and Data Hiding",\n        "Abstraction",\n        "Dunder/Magic Methods",\n        "Class methods",\n        "Static methods"\n      ]\n    },\n    {\n      "chapterTitle": "Data Structures",\n      "chapterSummary": "This chapter covers advanced Python data structures and their applications. Topics include list comprehensions, dictionaries, sets, and specialized collection types.",\n      "topics": [\n        "Lists and List Comprehensions",\n        "Dictionaries",\n        "Tuples",\n        "Sets and Frozen Sets",\n        "Collections module (namedtuple, deque, Counter)"\n      ]\n    },\n    {\n      "chapterTitle": "File Handling",\n      "chapterSummary": "This chapter explains how to read from and write to files in Python, including different file formats like text files, CSV, and JSON. It also covers error handling during file operations.",\n      "topics": [\n        "Reading Files",\n        "Writing to Files",\n        "File Modes (r, w, a, x, b, t)",\n        "Working with CSV files",\n        "Working with JSON files",\n        "File Exceptions and Handling",\n        "The \'with\' statement"\n      ]\n    },\n    {\n      "chapterTitle": "Functions and Modules",\n      "chapterSummary": "This chapter focuses on creating and using functions and modules to organize code. It includes topics like function parameters, variable scope, lambda functions, and importing modules.",\n      "topics": [\n        "Defining Functions",\n        "Function Parameters (positional, keyword, default)",\n        "Variable Scope (local vs. global)",\n        "Lambda Functions",\n        "Creating Modules",\n        "Importing Modules",\n        "Standard Modules (math, random, datetime)"\n      ]\n    },\n    {\n      "chapterTitle": "Error Handling",\n      "chapterSummary": "This chapter covers how to handle exceptions in Python using try-except blocks. It also explains how to raise custom exceptions.",\n      "topics": [\n        "Try-Except Blocks",\n        "Handling Multiple Exceptions",\n        "Raising Exceptions",\n        "Custom Exception Classes",\n        "Finally Block"\n      ]\n    },\n    {\n      "chapterTitle": "Essential Libraries",\n      "chapterSummary": "This chapter introduces some essential Python libraries for various tasks, including numerical computing (NumPy), data analysis (Pandas), and data visualization (Matplotlib).",\n      "topics": [\n        "NumPy: Working with arrays and numerical operations",\n        "Pandas: DataFrames, data manipulation, and analysis",\n        "Matplotlib: Creating plots and charts"\n      ]\n    },\n    {\n      "chapterTitle": "Advanced Python Concepts",\n      "chapterSummary": "This chapter explores advanced concepts such as iterators, generators, decorators, and context managers.",\n      "topics": [\n        "Iterators and Generators",\n        "Decorators",\n        "Context Managers",\n        "*args and **kwargs"\n      ]\n    }\n  ]\n}\n```',
    //     },
    //   ],
    // },
  ],
});
// const result = await ChatSession.sendMessage('INSERT PROMPT HERE');

// console.log(result.response.text());
