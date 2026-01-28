# Authentication System Documentation

## Overview
The LearnFlow platform implements a comprehensive authentication system with support for both students and teachers. The system includes secure login, registration, role-based access control, and automatic redirection.

## Features

### 1. Role-Based Authentication
- **Student Role**: Access to exercises, quizzes, chat, and personal analytics
- **Teacher Role**: Access to student management, analytics dashboard, and content creation tools
- Seamless role selection during login and registration

### 2. Client-Side Authentication
- React Context API for global authentication state management
- Protected route components to prevent unauthorized access
- Automatic token refresh and validation
- User profile persistence across sessions

### 3. Server-Side Authentication
- Next.js Middleware for route protection
- Server-side token validation
- Automatic redirects for unauthenticated users
- Support for return URLs after login

### 4. Components

#### Auth Context (`lib/auth-context.tsx`)
- Manages authentication state globally
- Handles login, registration, and logout
- Stores user data in localStorage
- Validates sessions on page load

#### Protected Route Component (`components/ProtectedRoute.tsx`)
- Wrapper component for protecting routes
- Supports role-based access control
- Automatic redirection to login if unauthenticated

#### Authentication Redirect Hook (`lib/use-auth-redirect.ts`)
- Custom hook for protecting individual pages
- Handles authentication checks and redirects
- Supports role-based access control

#### Server-Side Auth Utilities (`lib/server-auth.ts`)
- Server-side token validation
- Role-based access control for server components
- Session management utilities

#### Next.js Middleware (`middleware.ts`)
- Global route protection
- Automatic redirects to login for unauthenticated users
- Preserves return URLs for seamless navigation

## Implementation Details

### Login Process
1. User selects role (student/teacher)
2. Enters credentials
3. Authenticates against backend API
4. Session IDs stored in localStorage
5. User profile loaded and stored in context
6. Redirected to appropriate dashboard based on role or return URL

### Registration Process
1. User selects role (student/teacher)
2. Provides required information (name, email, password)
3. Students provide grade level, teachers provide department
4. Registers with backend API
5. Automatically logs in after successful registration
6. Redirected to appropriate dashboard based on role or return URL

### Route Protection
- Public routes: `/`, `/login`, `/register`
- Protected routes: All other routes require authentication
- Role-specific routes: Teachers and students have different dashboards
- Middleware ensures unauthorized users are redirected to login
- Return URLs preserved for seamless post-login experience

## Security Features
- Secure session storage in localStorage
- Session timeout validation
- Role-based access control
- Prevention of unauthorized route access
- Secure API communication with session headers

## API Integration
- Backend API endpoints for authentication
- Session-based authentication system
- User profile retrieval
- Role-specific endpoints

## Usage Examples

### Protecting a Page
```tsx
import { useAuthRedirect } from '@/lib/use-auth-redirect';

export default function ProtectedPage() {
  const { isAuthenticated, user, isLoading } = useAuthRedirect('student');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Protected content */}
    </div>
  );
}
```

### Using Protected Route Component
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="student">
      {children}
    </ProtectedRoute>
  );
}
```

### Server-Side Protection
```tsx
import { getServerAuthSession } from '@/lib/server-auth';

export default async function ServerProtectedPage() {
  const session = await getServerAuthSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      {/* Protected content */}
    </div>
  );
}
```

## Error Handling
- Graceful handling of authentication failures
- Clear error messages for users
- Automatic cleanup of invalid tokens
- Fallback mechanisms when backend is unavailable