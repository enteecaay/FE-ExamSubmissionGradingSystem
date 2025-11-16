# Development Guide

## Project Overview

This is a modern React + TypeScript frontend for a comprehensive course management system. The project follows best practices for scalability, maintainability, and developer experience.

## Getting Started

### Prerequisites
- Node.js 18+ (verify with `node --version`)
- npm 9+ (verify with `npm --version`)

### Initial Setup

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The app should open at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── layout/              # Layout wrappers (App, Auth)
│   ├── ui/                  # Reusable UI components (coming soon)
│   └── pages/               # Page container components
├── pages/                   # Page components (Login, Dashboard, etc)
├── router/                  # Route definitions and guards
├── services/                # API service layer
│   ├── client.ts           # Axios + JWT management
│   ├── auth.ts             # Login, register, logout
│   ├── courses.ts          # Semester, subject, exam management
│   ├── submissions.ts      # Submission and examiner management
│   ├── rubrics.ts          # Rubric management
│   └── violations.ts       # Violation management
├── store/                   # Zustand state management
│   ├── authStore.ts        # User auth state (persistent)
│   ├── courseStore.ts      # Course data (non-persistent)
│   └── uiStore.ts          # UI state (modals, notifications)
├── theme/                   # MUI theming
├── types/                   # TypeScript type definitions
├── utils/                   # Helper functions
├── client/                  # Auto-generated API types (git-ignored)
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
└── index.css               # Global styles
```

## Architecture Decisions

### State Management (Zustand)

We use Zustand for state management because it's:
- Lightweight (~2KB)
- Simple API
- Built-in persistence support
- No boilerplate

**Stores**:
- **authStore**: User, token, authentication state (persistent)
- **courseStore**: Course data, selections (ephemeral)
- **uiStore**: Loading, modals, notifications (ephemeral)

```typescript
// Usage in components
const { user, token, isAuthenticated } = useAuthStore();
const { isLoading, addNotification } = useUIStore();
```

### API Service Layer

Services wrap generated SDK methods with:
- Error handling
- Type safety
- Consistent request/response format
- Business logic

```typescript
// services/courses.ts
export const courseService = {
  async getExams(semesterId?: number) {
    try {
      const response = await courseClient.getClient().get('/api/exams');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      throw error;
    }
  }
};
```

### JWT Token Management

The client automatically:
1. Injects tokens into all requests
2. Detects 401 responses
3. Queues failed requests
4. Refreshes token
5. Retries original request
6. Clears auth on failure

### MUI + Tailwind Integration

- **MUI**: Handles spacing, colors, typography, components
- **Tailwind**: Provides grid, flexbox, responsive utilities (no spacing/colors)

This prevents conflicts while leveraging both frameworks' strengths.

## Common Development Tasks

### Adding a New Page

1. **Create page component**:
   ```typescript
   // src/pages/MyPage.tsx
   import React from 'react';
   
   const MyPage: React.FC = () => {
     return <div>My Page</div>;
   };
   
   export default MyPage;
   ```

2. **Add route**:
   ```typescript
   // src/router/index.tsx
   {
     path: 'my-page',
     element: <MyPage />,
   }
   ```

3. **Add navigation link**:
   ```typescript
   // src/components/layout/Sidebar.tsx
   {
     label: 'My Page',
     icon: MyIcon,
     path: '/my-page',
     roles: [0, 1, 2],
   }
   ```

### Protecting Routes

```typescript
// Require authentication
<ProtectedRoute>
  <PrivatePage />
</ProtectedRoute>

// Require specific roles (0=Admin, 1=Examiner, 2=Student)
<ProtectedRoute requiredRoles={[0, 1]}>
  <AdminOrExaminerPage />
</ProtectedRoute>
```

### Using Stores

```typescript
// Read state
const user = useAuthStore((state) => state.user);

// Use multiple values
const { user, token, isAuthenticated } = useAuthStore();

// Call actions
const { addNotification } = useUIStore();
addNotification({
  type: 'success',
  message: 'Operation successful!',
  duration: 3000,
});
```

### Making API Calls

```typescript
// In a component
const [data, setData] = React.useState(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState<string | null>(null);

React.useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await courseService.getExams();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Creating Reusable Components

Place UI components in `src/components/ui/`:

```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

export const Button: React.FC<ButtonProps> = (props) => (
  <MuiButton {...props} />
);

export default Button;
```

## Authentication Flow

### Login
1. User submits credentials
2. `authService.login()` sends request
3. API returns token + user data
4. Store token in localStorage
5. Update authStore
6. Redirect to dashboard

### Protected Routes
1. `ProtectedRoute` checks `useAuthStore()`
2. If unauthenticated, redirect to login
3. If role mismatch, redirect to unauthorized

### Token Refresh
1. Request gets 401 response
2. Axios interceptor detects 401
3. Queue current request
4. Send refresh request
5. Save new token
6. Retry original request + queued requests

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_GATEWAY_URL` | API Gateway base URL | `http://localhost:5103` |
| `VITE_API_IAM_PATH` | IAM service path | `/iam` |
| `VITE_API_COURSE_PATH` | Course service path | `/course` |
| `VITE_API_DIRECT_COURSE_URL` | Direct course API (optional) | `http://localhost:8082` |

## API Type Generation

### Automatic Generation

Types are auto-generated before each build. Source files:
- `apidocs1.json` - Course Management API
- `apidocs2.json` - IAM/Auth API

Output:
- `src/client/types.ts` - Generated types
- `src/client/schemas.ts` - JSON schemas

### Manual Generation

```bash
npm run generate-types
```

## Debugging

### Enable React DevTools
1. Install [React DevTools](https://chrome.google.com/webstore) browser extension
2. Open DevTools → Components tab
3. Inspect component hierarchy and state

### Enable MUI Profiler
```typescript
// In App.tsx
import { StrictMode } from 'react';

// Wrap with StrictMode to catch potential problems
<StrictMode>
  <App />
</StrictMode>
```

### Check Store State

```typescript
// In console
import { useAuthStore } from '@/store';
const state = useAuthStore.getState();
console.log(state);
```

### Network Debugging
1. Open DevTools → Network tab
2. Make API request
3. Inspect request/response

## Testing

### Run Tests
```bash
npm test
```

### Example Unit Test (to be added)
```typescript
// src/__tests__/utils/helpers.test.ts
import { formatDate, getRoleDisplayName } from '@/utils';

describe('helpers', () => {
  test('formatDate should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });

  test('getRoleDisplayName should return correct names', () => {
    expect(getRoleDisplayName(0)).toBe('Admin');
    expect(getRoleDisplayName(1)).toBe('Examiner');
    expect(getRoleDisplayName(2)).toBe('Student');
  });
});
```

## Code Quality

### ESLint
```bash
npm run lint
```

### Fix Formatting
```bash
npm run lint -- --fix
```

## Performance Tips

1. **Lazy Load Routes**:
   ```typescript
   const MyPage = React.lazy(() => import('@/pages/MyPage'));
   ```

2. **Memoize Components**:
   ```typescript
   const MyComponent = React.memo(({ data }) => {
     return <div>{data}</div>;
   });
   ```

3. **Use Suspense**:
   ```typescript
   <React.Suspense fallback={<Loading />}>
     <MyPage />
   </React.Suspense>
   ```

## Deployment

### Build for Production
```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Clear Cache
```bash
rm -rf node_modules .vite dist
npm install
```

### Type Generation Failed
```bash
rm -rf src/client
npm run generate-types
```

## Further Reading

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Material-UI Documentation](https://mui.com/material-ui)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

## Support

For issues or questions:
1. Check the README.md
2. Review the project structure
3. Consult the linked documentation
4. Ask your team lead
