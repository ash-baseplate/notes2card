import { GoogleGenAI } from '@google/genai';

const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const aiV2 = new GoogleGenAI({ apiKey: apikey });

const JSONConfig = {
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  },
};
const HTMLConfig = {
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  },
};

// const modelv2 = 'gemini-2.5-flash';
const modelv2 = 'gemini-3-flash-preview';
// Course Outline Generation Model
const courseOutlineContents = [
  {
    role: 'user',
    parts: [
      {
        text: `Generate a study material for Java development for Practice and level of difficulty  will be Easy with summary of course,  List of Chapters max 3 along with summary and emoji for each chapter, Topic list in each chapter in  JSON format

{
  "courseTitle": "",
  "courseSummary": "",
 
  "chapters": [
    {
      "chapterTitle": "",
      "emoji": "",
      "chapterSummary": "",
      "topics": []
    }
  ]
}
`,
      },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: `\`\`\`json
{
  "courseTitle": "Java Kickstart: Beginner's Practice Guide",
  "courseSummary": "A hands-on, simplified course designed for absolute beginners. This material focuses on understanding the core syntax of Java, writing basic logic, and creating your first functional programs without getting overwhelmed by complex theory.",
  "chapters": [
    {
      "chapterTitle": "Setting Up & First Steps",
      "emoji": "☕",
      "chapterSummary": "Learn how to prepare your computer for Java development and write your very first running program to understand the basic code structure.",
      "topics": [
        "Installing the JDK and an IDE (IntelliJ or Eclipse)",
        "Understanding the 'public static void main' structure",
        "Writing a 'Hello World' program",
        "Printing to the console (System.out.println)",
        "Compiling and running Java code"
      ]
    },
    {
      "chapterTitle": "Variables & Data Types",
      "emoji": "📦",
      "chapterSummary": "Understand how to store information in your code. This chapter covers the building blocks of data manipulation.",
      "topics": [
        "Primitive Data Types (int, double, boolean, char)",
        "Working with Strings",
        "Declaring and initializing variables",
        "Basic Arithmetic Operators (+, -, *, /)",
        "String Concatenation"
      ]
    },
    {
      "chapterTitle": "Control Flow Logic",
      "emoji": "🚦",
      "chapterSummary": "Learn how to make your program 'think' by making decisions and repeating tasks using loops.",
      "topics": [
        "If-Else and Else-If statements",
        "Comparison Operators (>, <, ==, !=)",
        "Logical Operators (AND, OR, NOT)",
        "The Switch statement",
        "Basic Loops (For Loop and While Loop)"
      ]
    },
  ]
}
\`\`\``,
      },
    ],
  },
  {
    role: 'user',
    parts: [
      {
        text: `INSERT_INPUT_HERE`,
      },
    ],
  },
];

export const courseOutline = async (userPrompt) => {
  // Use the constant history with the example course outline
  const conversationHistory = [
    ...courseOutlineContents,
    {
      role: 'user',
      parts: [{ text: userPrompt }],
    },
  ];

  try {
    const response = await aiV2.models.generateContent({
      model: modelv2,
      config: JSONConfig,
      contents: conversationHistory,
    });

    // Handle different response structures
    let resultText =
      (typeof response.text === 'function' && response.text()) ||
      (typeof response.response?.text === 'function' && response.response.text()) ||
      response.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('') ||
      '';

    // Clean up markdown code fences if present (e.g., ```json ... ```)
    resultText = resultText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    return resultText;
  } catch (error) {
    console.error('Error in courseOutline:', error);
    throw error;
  }
};

// Chapter Notes Content Generation Model
const chapterNotesContents = [
  {
    role: 'user',
    parts: [
      {
        text: `
Generate detail content for exam material on each chapter Make sure to includes all topic point in the content, make sure to give content in HTML format (Do not Add HTMLK , Head, Body, title tag)  and to use proper styling whenever necessary, The chapters
{
      "chapterTitle": "Get Started with Flutter",
      "emoji": "🚀",
      "chapterSummary": "Learn how to install Flutter, set up your development environment, and run your very first Flutter application on an emulator or a physical device.",
      "topics": [
        "What is Flutter?",
        "Running your first 'Hello World' app",
        "Understanding \`main.dart\` and basic project structure"
      ]
    },`,
      },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: `**Generating Flutter Exam Material**

I'm now focused on crafting detailed HTML content for the "Get Started with Flutter" exam. The goal is to produce focused content about "What is Flutter?" and "Installing Flutter SDK," excluding the basic HTML structure. I am specifically generating code snippets for HTML output.


**Developing Flutter Tutorial Modules**

I'm now generating content for "Setting up an IDE" (VS Code/Android Studio), covering installation steps, and emphasizing choosing an IDE. Next, I'm focusing on "Creating a New Flutter Project," detailing the command-line approach and essential project structures. The current task will finish by explaining how to run a simple "Hello World" app, and then detailing the \`main.dart\` file and the basic project structure. I'm focusing on providing clear explanations and practical code snippets. I am also working on adding styling where needed, to improve readability.


**Detailing Flutter SDK Installation**

I'm now detailing the Flutter SDK installation, covering system requirements and the download process from the official site. The key focus is path configuration, which is critical for exams, and the use of the \`flutter doctor\` command for verifying the setup. I've also pivoted slightly to include some key exam tips at the end of the section, with key takeaways being highlighted.

\`\`\`html
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <!-- Header -->
  <div style="background-color: #e3f2fd;
\`\`\`

`,
      },
      {
        text: `\`\`\`html
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto;">

    <!-- Chapter Header -->
    <div style="background-color: #e1f5fe; padding: 25px; border-left: 5px solid #0288d1; border-radius: 4px; margin-bottom: 30px;">
        <h1 style="color: #01579b; margin-top: 0;">🚀 Get Started with Flutter</h1>
        <p style="font-size: 1.1rem; color: #455a64; margin-bottom: 0;">
            <strong>Chapter Summary:</strong> Learn how to install Flutter, set up your development environment, and run your very first Flutter application on an emulator or a physical device.
        </p>
    </div>

    <!-- Topic 1: What is Flutter? -->
    <section style="margin-bottom: 40px;">
        <h2 style="color: #0277bd; border-bottom: 2px solid #b3e5fc; padding-bottom: 10px;">1. What is Flutter?</h2>
        <p><strong>Flutter</strong> is Google's open-source UI software development kit (SDK). It allows developers to build natively compiled applications for mobile (Android, iOS), web, and desktop from a single codebase.</p>
        
        <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; border: 1px solid #ffe0b2; margin: 15px 0;">
            <strong style="color: #e65100;">Exam Key Concept:</strong> Flutter is <em>not</em> a language; it is an SDK that uses the <strong>Dart</strong> programming language.
        </div>

        <h3>Core Characteristics:</h3>
        <ul style="list-style-type: disc; margin-left: 20px;">
            <li><strong>Single Codebase:</strong> Write once, deploy everywhere.</li>
            <li><strong>Dart Language:</strong> Optimized for UI, supporting both Just-In-Time (JIT) compilation (for hot reload) and Ahead-Of-Time (AOT) compilation (for production performance).</li>
            <li><strong>Everything is a Widget:</strong> The UI is built by composing widgets. A widget describes what its view should look like given its current configuration and state.</li>
            <li><strong>High Performance:</strong> Flutter does not use OEM widgets (like React Native); it draws its own widgets using its own rendering engine (Skia or Impeller).</li>
        </ul>
    </section>

    <!-- Topic 5: Running your first 'Hello World' app -->
    <section style="margin-bottom: 40px;">
        <h2 style="color: #0277bd; border-bottom: 2px solid #b3e5fc; padding-bottom: 10px;">5. Running your first 'Hello World' app</h2>
        <p>To run the application, you need a target device (either a physical phone connected via USB with USB Debugging enabled or a virtual emulator).</p>

        <h3>Steps to Run:</h3>
        <ol style="margin-left: 20px;">
            <li>Ensure a device is selected in the bottom right of VS Code or device manager in Android Studio.</li>
            <li>Execute the run command in the terminal or click the "Run/Play" button in the IDE.</li>
        </ol>

        <div style="background-color: #263238; color: #fff; padding: 15px; border-radius: 5px; font-family: 'Courier New', Courier, monospace;">
            $ flutter run
        </div>

        <p style="margin-top: 15px;">This command compiles the code and launches the app. The default "Counter App" usually appears, but we will modify it to be a "Hello World" app.</p>
    </section>

    <!-- Topic 6: Understanding main.dart and project structure -->
    <section style="margin-bottom: 40px;">
        <h2 style="color: #0277bd; border-bottom: 2px solid #b3e5fc; padding-bottom: 10px;">6. Understanding \`main.dart\` and basic project structure</h2>
        
        <h3>Basic Folder Structure:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="padding: 5px 0; border-bottom: 1px solid #eee;">📂 <strong>android/ & ios/</strong>: Platform-specific code used for generating the native app shell.</li>
            <li style="padding: 5px 0; border-bottom: 1px solid #eee;">📂 <strong>lib/</strong>: Contains all your Dart code. This is where 99% of your work happens.</li>
            <li style="padding: 5px 0; border-bottom: 1px solid #eee;">📄 <strong>lib/main.dart</strong>: The entry point of the application.</li>
            <li style="padding: 5px 0; border-bottom: 1px solid #eee;">📄 <strong>pubspec.yaml</strong>: The configuration file for dependencies (packages), assets (images/fonts), and version settings.</li>
        </ul>

        <h3>The \`main.dart\` File:</h3>
        <p>Every Flutter app must have a <code>main()</code> function.</p>

        <div style="background-color: #f5f5f5; border-left: 4px solid #4caf50; padding: 15px; overflow-x: auto;">
<pre style="margin: 0; font-family: 'Courier New', Courier, monospace; color: #333;">
import 'package:flutter/material.dart';

// 1. The Entry Point
void main() {
  runApp(MyApp());
}

// 2. The Root Widget
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // MaterialApp wraps the app with Material Design functionality
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Welcome to Flutter'),
        ),
        body: Center(
          child: Text('Hello World'),
        ),
      ),
    );
  }
}
</pre>
        </div>

        <h3>Code Breakdown for Exams:</h3>
        <ul style="margin-left: 20px;">
            <li><strong>import:</strong> Imports the Material UI library.</li>
            <li><strong>main():</strong> The function where execution begins.</li>
            <li><strong>runApp():</strong> A function that inflates the given widget (MyApp) and attaches it to the screen.</li>
            <li><strong>MaterialApp:</strong> A widget that provides standard styling and navigation.</li>
            <li><strong>Scaffold:</strong> Implements the basic visual layout structure (app bar, body, floating action button).</li>
            <li><strong>Center:</strong> A layout widget that centers its child.</li>
            <li><strong>Text:</strong> A widget that displays a string of text.</li>
        </ul>
    </section>

</div>
\`\`\``,
      },
    ],
  },
  {
    role: 'user',
    parts: [
      {
        text: `INSERT_INPUT_HERE`,
      },
    ],
  },
];

export const chapterNotesGenerator = async (userPrompt) => {
  // Use the constant history with the example chapter notes
  const conversationHistory = [
    ...chapterNotesContents,
    {
      role: 'user',
      parts: [{ text: userPrompt }],
    },
  ];

  try {
    const response = await aiV2.models.generateContent({
      model: modelv2,
      config: HTMLConfig,
      contents: conversationHistory,
    });

    // Handle different response structures
    let resultText =
      (typeof response.text === 'function' && response.text()) ||
      (typeof response.response?.text === 'function' && response.response.text()) ||
      response.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('') ||
      '';

    // Clean up markdown code fences if present (e.g., ```html ... ```)
    resultText = resultText
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    return resultText;
  } catch (error) {
    console.error('Error in chapterNotesGenerator:', error);
    throw error;
  }
};

// Study Type Content Generation Model
const StudyTypeContents = [
  {
    role: 'user',
    parts: [
      {
        text: `Generate the flashcard on topic : Flutter Fundamentals,User Interface (UI) Development,Basic App Navigation in JSON format with front back content, Maximum 5

`,
      },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: `Here are 5 essential flashcards covering **Flutter Fundamentals**, **UI Development**, and **Basic App Navigation** in JSON format.

\`\`\`json
[
  {
    "front": "What is Flutter?",
    "back": "Flutter is an open-source UI software development kit created by Google used to build natively compiled applications for mobile, web, and desktop from a single codebase."
  },
  {
    "front": "What does the phrase 'Everything is a Widget' mean in Flutter?",
    "back": "It means that every element of a Flutter UI—from a simple button or text to the layout structure itself (like padding or centering)—is built using widgets."
  },
  {
    "front": "What is the difference between a StatelessWidget and a StatefulWidget?",
    "back": "A StatelessWidget is immutable and does not change its properties over time. A StatefulWidget can maintain state and update its UI dynamically when data changes."
  },
  {
    "front": "What is the purpose of the 'Scaffold' widget?",
    "back": "The Scaffold widget provides a high-level API for implementing the basic Material Design visual layout structure, including an AppBar, Drawer, SnackBar, and BottomNavigationBar."
  },
  {
    "front": "How do 'Row' and 'Column' widgets differ in layout?",
    "back": "A Row arranges its children horizontally (Main Axis: Horizontal), while a Column arranges its children vertically (Main Axis: Vertical)."
  }
]
\`\`\``,
      },
    ],
  },
  {
    role: 'user',
    parts: [
      {
        text: `INSERT_INPUT_HERE`,
      },
    ],
  },
];

export const GenerateStudyTypeContentAiModel = async (userPrompt) => {
  // Use the constant history with the example flashcards
  const conversationHistory = [
    ...StudyTypeContents,
    {
      role: 'user',
      parts: [{ text: userPrompt }],
    },
  ];

  try {
    const response = await aiV2.models.generateContent({
      model: modelv2,
      config: JSONConfig,
      contents: conversationHistory,
    });

    // Handle different response structures
    let resultText =
      (typeof response.text === 'function' && response.text()) ||
      (typeof response.response?.text === 'function' && response.response.text()) ||
      response.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('') ||
      '';

    // Clean up markdown code fences if present (e.g., ```json ... ```)
    resultText = resultText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    return resultText;
  } catch (error) {
    console.error('Error in GenerateStudyTypeContentAiModel:', error);
    throw error;
  }
};
