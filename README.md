# Notes2Card

AI-powered learning workspace that turns raw notes into complete study systems: course outlines, flashcards, quizzes, notes, and AI tutoring.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-06B6D4)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-C5F74F)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF)
![License](https://img.shields.io/badge/License-TBD-lightgrey)

## Live Demo

- Website: https://notes2card.vercel.app/

## Why Notes2Card

Studying from unstructured notes is slow and inconsistent. Notes2Card transforms a topic into a guided, interactive learning path so learners can move from "what should I study?" to "I can test and retain this" in minutes.

## Core Highlights

- AI-generated course outlines from any topic
- One-click material generation for flashcards, quizzes, and chapter notes
- Difficulty-aware learning paths (Easy, Medium, Hard)
- Built-in AI tutor for contextual Q&A
- Secure auth with Clerk and premium upgrade flow via Stripe
- Async generation pipelines with Inngest for better reliability
- Responsive dashboard experience with modern UI primitives

## Product Flow

1. Enter a topic and choose difficulty.
2. Generate a structured course outline with chapters.
3. Produce study assets (flashcards, quizzes, notes).
4. Review progress from a central dashboard.
5. Upgrade for unlimited course generation.

## Tech Stack

### Frontend

- **Framework**: Next.js 16.0.10
- **UI Components**: Radix UI, Lucide React, Embla Carousel
- **Styling**: Tailwind CSS 4, PostCSS
- **State Management**: React Context
- **Authentication**: Clerk NextJS
- **Animations**: Lottie Files, Typewriter Effect
- **Notifications**: Sonner
- **Theme**: next-themes

### Backend & Services

- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL via Neon
- **ORM**: Drizzle ORM
- **AI/ML**: Google Gemini AI, Anthropic Claude AI
- **Async Jobs**: Inngest
- **Payments**: Stripe
- **HTTP Client**: Axios

### Development Tools

- **Build Tool**: Webpack (via Next.js)
- **Compiler**: Babel React Compiler
- **Code Generation**: Drizzle Kit
- **Environment**: Dotenv

## Architecture Snapshot

```
notes2card/
├── app/                              # Next.js app directory
│   ├── api/                         # API routes
│   │   ├── courses/                 # Course management
│   │   ├── generate-course-outline/ # AI course generation
│   │   ├── generate-study-type-content/ # Study materials generation
│   │   ├── payment/                 # Stripe payment handling
│   │   ├── qa/                      # Q&A functionality
│   │   └── study-type/              # Study material types
│   ├── (auth)/                      # Authentication pages (Sign-in, Sign-up)
│   ├── course/                      # Course display pages
│   ├── dashboard/                   # User dashboard
│   ├── create/                      # Course creation flow
│   ├── landing/                     # Landing page
│   └── layout.js                    # Root layout
├── components/
│   └── ui/                          # Reusable UI components
├── configs/
│   ├── AiModel.js                   # AI model configurations
│   ├── db.js                        # Database connection
│   └── schema.js                    # Database schema
├── inngest/
│   ├── client.js                    # Inngest client
│   └── functions.js                 # Background job definitions
├── lib/
│   ├── aiError.js                   # AI error handling
│   └── utils.js                     # Utility functions
└── public/                          # Static assets
```

## Data Model Overview

### users

- User profiles and authentication metadata
- Free tier course limits (3 courses max)
- Stripe customer ID for payment tracking

### study_material

- Course information and metadata
- Difficulty levels and course layout
- Generation status tracking
- Created timestamp

### chapter_notes

- Detailed notes for each chapter
- Content storage for study materials

### study_type_content

- Generated flashcards, quizzes, and other materials
- Content in JSON format
- Generation status

### payment_record

- Payment records and upgrade tracking
- Stripe session and customer IDs

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (Neon)
- Google Gemini API key
- Clerk API keys
- Stripe API keys

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd notes2card
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_CONNECTION_STRING=your_neon_postgres_connection_string

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

4. **Set up the database**

```bash
npm run db:push  # Using drizzle-kit
```

5. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with webpack

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run db:push     # Push schema to database
npm run db:studio   # Open Drizzle Studio
```

## Feature Deep Dive

### Course Generation Flow

1. User enters a topic and selects difficulty level
2. API calls `generate-course-outline` endpoint
3. Gemini AI generates a structured course outline with chapters and topics
4. Inngest background job processes and stores the course
5. User can access generated content via dashboard

### Study Material Generation

Multiple study types can be generated from a course:

- **Flashcards**: Question-answer pairs for memorization
- **Quizzes**: Assessment questions with answers
- **Notes**: Structured study notes by chapter
- **AI Tutor**: Interactive Q&A based on study materials

### Pricing Model

- **Free Tier**: Up to 3 courses per user
- **Premium**: Unlimited courses via Stripe payment
- Free tier limits enforced at both UI and API level

### Error Handling

AI errors are classified and mapped to user-friendly messages using `lib/aiError.js`:

- Invalid AI responses trigger automatic retries via Inngest
- Failed generations are marked with "Failed" status to prevent stuck states
- User receives clear error messages with actionable feedback

## User Journey

1. **Landing Page** → Marketing with features and product demo
2. **Sign Up/Sign In** → Clerk authentication
3. **Dashboard** → View all created courses
4. **Create Course** → Generate new course via AI
5. **Course View** → Access course chapters and materials
6. **Study Materials** → Generate/view flashcards, quizzes, notes
7. **Premium** → Upgrade via Stripe payment for unlimited courses

## AI Integration

### Gemini Configuration

- **Model**: Gemini 3-Flash (preview)
- **Temperature**: 0.3-0.4 (controlled randomness)
- **Max Tokens**: 8192
- **Output Formats**: JSON and plain text

### Supported AI Tasks

- Course outline generation (max 4 chapters for performance)
- Flashcard generation
- Quiz generation
- Interactive Q&A tutor
- Notes summarization

## Performance Considerations

- Course outline generation limited to max 4 chapters for faster processing
- AI tutor context uses study material `topic` field (fallback to courseTitle)
- Async processing via Inngest prevents blocking requests
- React Compiler enabled for optimized rendering
- Webpack used for bundle optimization

## Authentication & Security

- **Clerk Integration**: Complete auth system with sign-in/sign-up
- **API Protection**: User context validation on protected routes
- **Session Management**: Automatic session handling via Clerk
- **Payment Security**: Stripe webhook validation for payments

## Deployment

The application is ready to deploy on Vercel:

```bash
npm run build
vercel deploy
```

Ensure all environment variables are configured in Vercel dashboard.

## Roadmap Ideas

- Spaced repetition scheduling for flashcards
- Study streaks and retention analytics
- Team/classroom mode with shared courses
- Export options (PDF, Anki-compatible formats)

## Contributing

Contributions are welcome! Please ensure:

- Code follows existing patterns
- AI errors are properly classified
- Database migrations are tested
- Study material generation is tested with various topics

## Support

For issues or questions:

- Check the documentation
- Review existing issues
- Create a new issue with detailed description

## License

TBD.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- AI powered by [Google Gemini](https://ai.google.dev)
- Authentication by [Clerk](https://clerk.com)
- Payments by [Stripe](https://stripe.com)
- Job processing by [Inngest](https://inngest.com)
