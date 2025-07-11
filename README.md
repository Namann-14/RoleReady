# AI Roadmap Generator

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## About

AI Roadmap Generator helps users create personalized learning roadmaps for AI topics. It leverages Gemini API to generate structured, actionable plans, including phases, references, video links, and practice questions.

## Features

- User authentication
- AI-powered roadmap generation ([Gemini API](https://ai.google.dev/gemini-api/docs))
- MongoDB integration for storing roadmaps
- Responsive UI with custom sidebar navigation
- Editable and shareable roadmaps

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

Create a `.env.local` file and add your Gemini API key and MongoDB URI:

```
GEMINI_API_KEY=your-gemini-api-key
MONGODB_URI=your-mongodb-uri
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for