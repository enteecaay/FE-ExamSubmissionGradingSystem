# Course Management System - Frontend

A modern React + TypeScript frontend for a comprehensive course management system with exam administration, submission grading, and violation tracking.

## Tech Stack

- **Framework**: React 18.3 + TypeScript 5.6
- **Build Tool**: Vite 7.2
- **UI Framework**: Material-UI (MUI) 6.1 with Tailwind CSS 4.0
- **State Management**: Zustand 4.5
- **HTTP Client**: Axios with JWT interceptors
- **Routing**: React Router 6.28
- **API Type Generation**: @hey-api/openapi-ts 0.53
- **Color Scheme**: Emerald & Blue palette with custom MUI theming

## Project Structure

```
src/
├── components/
│   ├── layout/              # Layout components (Navbar, Sidebar, AppLayout)
│   ├── ui/                  # Reusable UI components (Button, Form, etc.)
│   └── pages/               # Page-level components
├── pages/                   # Page components for routes
├── router/                  # Route definitions and ProtectedRoute
├── services/                # API service layer
│   ├── client.ts           # Axios client with JWT interceptors
│   ├── auth.ts             # Authentication service
│   ├── courses.ts          # Course/Exam management
│   ├── submissions.ts      # Submission & Examiner management
│   ├── rubrics.ts          # Rubric management
│   └── violations.ts       # Violation management
├── store/                   # Zustand stores
│   ├── authStore.ts        # Authentication state (persistent)
│   ├── courseStore.ts      # Course data state
│   └── uiStore.ts          # UI state (modals, notifications)
├── theme/                   # MUI theme configuration
├── types/                   # TypeScript types and declarations
├── utils/                   # Utility functions
├── client/                  # Auto-generated types from OpenAPI (git-ignored)
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
└── index.css               # Global styles
```

## Installation

### Prerequisites

- Node.js 18+
- npm 9+ or yarn 4+

### Setup Steps

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env.local` and update the values:

   ```bash
   cp .env.example .env.local
   ```

   Key variables:

   - `VITE_API_GATEWAY_URL`: API Gateway URL (e.g., `http://localhost:5103`)
   - `VITE_API_IAM_PATH`: IAM service path (e.g., `/iam`)
   - `VITE_API_COURSE_PATH`: Course service path (e.g., `/course`)
   - `VITE_API_DIRECT_COURSE_URL`: Optional direct course API URL for development

3. **Start development server**:

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build
npm run build           # Build for production (includes type generation)
npm run preview         # Preview production build locally

# Code Quality
npm run lint            # Run ESLint

# API Type Generation
npm run openapi-ts      # Generate TypeScript types from OpenAPI specs
npm run openapi-ts:watch # Watch for changes and regenerate
```

## API Configuration

The frontend is configured to work with two API services:

### 1. IAM Service (Authentication)

- **Base URL**: `{VITE_API_GATEWAY_URL}{VITE_API_IAM_PATH}`
- **Endpoints**:
  - `POST /api/auth/login`
  - `POST /api/auth/register`

### 2. Course Management Service

- **Base URL**: `{VITE_API_GATEWAY_URL}{VITE_API_COURSE_PATH}`
- **Endpoints**:
  - Semesters, Subjects, Exams, Submissions
  - Examiners, Rubrics, Violations

### JWT Token Handling

The client automatically:

- Injects JWT tokens into all requests as `Authorization: Bearer {token}`
- Handles 401 responses by attempting token refresh
- Queues failed requests during token refresh
- Clears auth on token refresh failure

Token storage:

- Access Token: `localStorage[VITE_TOKEN_STORAGE_KEY]`
- Refresh Token: `localStorage[VITE_REFRESH_TOKEN_STORAGE_KEY]`

## State Management

### AuthStore (Zustand)

Persistent store for user authentication:

```typescript
const { user, token, isAuthenticated, setUser, setToken, clearAuth } =
  useAuthStore();
```

### CourseStore (Zustand)

Ephemeral store for course data:

```typescript
const { semesters, exams, submissions, setSemesters, setExams } =
  useCourseStore();
```

### UIStore (Zustand)

Store for UI state (modals, notifications):

```typescript
const { isLoading, notifications, addNotification, toggleModal } = useUIStore();
```

## Services Layer

All API calls go through a custom service layer that wraps the generated SDK:

```typescript
import {
  authService,
  courseService,
  submissionService,
  rubricService,
  violationService,
} from "@/services";

// Example usage
const response = await authService.login({
  keyLogin: "user@example.com",
  password: "password",
});
const exams = await courseService.getExams(semesterId, subjectId);
const submission = await submissionService.gradeSubmission(submissionId, {
  totalScore: 95,
});
```

## MUI + Tailwind CSS Integration

### Configuration

- **Tailwind**: Configured with disabled core plugins (spacing, colors, typography)
- **MUI**: Handles spacing, colors, typography, and component styling
- **Tailwind Usage**: Grid, Flexbox, and responsive utilities only

### Color Palette

- **Primary**: Emerald (#22c55e)
- **Secondary**: Blue (#0ea5e9)
- **Accent Colors**: Various shades available

### Custom Components

MUI components are extended with:

- Custom styling through `sx` prop
- Theme tokens for consistent colors
- Tailwind utilities for layout (flexbox, grid)

## Type Generation

### Auto-generation Workflow

Types are automatically generated from OpenAPI specs on every build:

1. **Input files**: `apidocs1.json` (Course) and `apidocs2.json` (Auth)
2. **Output folder**: `src/client/`
3. **Generated types**: Namespaced as `AuthApi` and `CourseApi`

### Manual Generation

```bash
npm run openapi-ts              # Generate once
npm run openapi-ts:watch        # Watch mode during development
```

Generated files:

- `src/client/auth/types.gen.ts` - Auth API types
- `src/client/course/types.gen.ts` - Course API types
- `src/client/*/sdk.gen.ts` - Generated SDK methods

## Development Workflow

1. **Define API specs** in `apidocs1.json` and `apidocs2.json`
2. **Generate types**: `npm run openapi-ts`
3. **Create service layer**: Wrap SDK in `src/services/`
4. **Build components**: Use services in React components
5. **Consume stores**: Access state via Zustand hooks

## Environment-Specific Configuration

### Development

- Uses `http://localhost:5103` for API Gateway
- Optional `http://localhost:8082` for direct Course API access

### Production

Update `.env.production`:

```bash
VITE_API_GATEWAY_URL=https://your-api-gateway.com
VITE_API_IAM_PATH=/iam
VITE_API_COURSE_PATH=/course
```

## Authentication Flow

1. **Login**: User submits credentials → Auth service → Token stored in localStorage
2. **Protected Routes**: Checked by `ProtectedRoute` component
3. **Token Expiration**: Automatic refresh on 401 response
4. **Logout**: Clear tokens and redirect to login

## Role-Based Access Control

Three user roles:

- **0**: Admin (access to all features)
- **1**: Examiner (submissions, grading)
- **2**: Student (dashboard, exams)

Routes are protected with role checks via `ProtectedRoute`:

```typescript
<ProtectedRoute requiredRoles={[0, 1]}>
  <SubmissionsPage />
</ProtectedRoute>
```

## Error Handling

- **API Errors**: Logged to console and can be caught in try-catch
- **Global Errors**: Can be handled via error boundary (to be implemented)
- **Notifications**: Use `useUIStore().addNotification()` for user feedback

## Performance Optimizations

- Code splitting via React Router
- Lazy component loading
- Memoization of expensive computations
- Efficient re-renders with Zustand

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Type generation fails

```bash
# Clear cache and regenerate
rm -rf src/client/
npm run openapi-ts
```

### Build fails with missing dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### API requests fail

- Check `.env.local` configuration
- Verify API services are running
- Check browser console for CORS errors
- Verify JWT token is valid

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Run linting: `npm run lint`
4. Commit: `git commit -am 'Add your feature'`
5. Push: `git push origin feature/your-feature`

## License

ISC
