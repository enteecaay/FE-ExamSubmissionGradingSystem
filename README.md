# Course Management System - Frontend

A React + TypeScript frontend for managing exams, submissions, and grading.

## Tech Stack

- React 18 + TypeScript
- Vite
- Material-UI (MUI) + Tailwind CSS
- Zustand (state management)
- React Router
- Axios

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` file and add:

   ```
   VITE_API_GATEWAY_URL=http://localhost:5103
   VITE_API_IAM_PATH=/iam
   VITE_API_COURSE_PATH=/course
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/      # React components
├── pages/          # Page components
├── services/       # API services
├── store/          # Zustand stores
├── router/         # Route definitions
├── theme/          # MUI theme
└── utils/          # Utility functions
```

## Authentication

- Login and register functionality
- JWT token-based authentication
- Automatic token refresh on 401 errors
- Role-based access control (Admin, Examiner, Student)

## Features

- Exam management
- Submission grading
- Violation tracking
- User dashboard

## License

ISC
