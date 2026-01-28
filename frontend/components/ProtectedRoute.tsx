'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'student' | 'teacher' | 'any'; // Specify required role, or 'any' for any authenticated user
  fallbackUrl?: string; // URL to redirect to if not authenticated
}

export function ProtectedRoute({ 
  children, 
  role = 'any', 
  fallbackUrl = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(fallbackUrl);
        return;
      }

      // If role is specified and user doesn't match, redirect to appropriate dashboard
      if (role !== 'any' && user && user.role !== role) {
        const redirectUrl = user.role === 'teacher' ? '/teacher-dashboard' : '/';
        router.push(redirectUrl);
      }
    }
  }, [isAuthenticated, user, isLoading, role, fallbackUrl, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If authenticated and has correct role (or role is 'any'), render children
  if (isAuthenticated && (role === 'any' || user?.role === role)) {
    return <>{children}</>;
  }

  // If not authenticated or wrong role, don't render anything (will be redirected by useEffect)
  return null;
}