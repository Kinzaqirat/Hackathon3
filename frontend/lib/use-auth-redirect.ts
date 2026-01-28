'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Custom hook to protect routes based on authentication status and user role
 * @param role - The required role ('student' | 'teacher' | 'any') - defaults to 'any'
 * @param fallbackUrl - The URL to redirect to if not authenticated - defaults to '/login'
 */
export function useAuthRedirect(role: 'student' | 'teacher' | 'any' = 'any', fallbackUrl: string = '/login') {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackUrl);
    } else if (!isLoading && isAuthenticated && role !== 'any' && user?.role !== role) {
      // Redirect to appropriate dashboard if user doesn't have required role
      const redirectUrl = user?.role === 'teacher' ? '/teacher-dashboard' : '/';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, user, isLoading, role, fallbackUrl, router]);

  return { isAuthenticated, user, isLoading };
}