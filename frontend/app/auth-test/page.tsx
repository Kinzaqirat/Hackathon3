'use client';

import { useAuth } from '@/lib/auth-context';
import { useAuthRedirect } from '@/lib/use-auth-redirect';
import { useEffect, useState } from 'react';

export default function AuthTestPage() {
  // Use the auth redirect hook to protect this page
  const { isAuthenticated, user, isLoading: authLoading } = useAuthRedirect('any', '/login');
  const { logout } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  // Simulate some local loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = authLoading || localLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-3xl font-bold">Authentication Test</h1>
        <p>You are not authenticated. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="bg-card border rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">ID:</span> {user.id}</p>
          </div>
          <div>
            <p><span className="font-medium">Role:</span> {user.role}</p>
            <p><span className="font-medium">Active:</span> {user.is_active ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        {user.role === 'student' && (
          <div className="mt-4">
            <p><span className="font-medium">Grade Level:</span> {user.grade_level}</p>
          </div>
        )}
        
        {user.role === 'teacher' && (
          <div className="mt-4">
            <p><span className="font-medium">Department:</span> {user.department}</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          Refresh Page
        </button>
        
        <button 
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">Authentication Status</h3>
        <p>This page is protected and can only be accessed when authenticated.</p>
        <p className="text-sm text-muted-foreground mt-2">
          If you can see this page, the authentication system is working correctly.
        </p>
      </div>
    </div>
  );
}