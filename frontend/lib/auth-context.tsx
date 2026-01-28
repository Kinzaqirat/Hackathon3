'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  grade_level?: string;  // For students
  department?: string;   // For teachers
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
  role: 'student' | 'teacher';  // Add role field
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'teacher') => Promise<boolean>;
  register: (userData: { email: string; name: string; password: string; grade_level?: string }, role: 'student' | 'teacher') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (token) {
      // Ensure token is also in cookie for middleware
      try {
        fetch('/api/auth/set-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        }).catch(err => console.error('Failed to sync session cookie:', err));
      } catch (err) {
        console.error('Failed to sync session cookie:', err);
      }
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    // Extract user info from the token format: "ROLE|USERID|EMAIL"
    try {
      const parts = token.split('|');
      if (parts.length === 3) {
        const role = parts[0];
        const user_id = parts[1];
        const email = parts[2];

        const userObj: User = {
          id: parseInt(user_id),
          email: email,
          name: email.split('@')[0], // Use part of email as name
          is_active: true,
          created_at: new Date().toISOString(),
          user_id: user_id,
          role: role as 'student' | 'teacher',
        };

        setUser(userObj);
      }
    } catch (error) {
      console.error('Failed to reconstruct user from token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'student' | 'teacher'): Promise<boolean> => {
    try {
      const endpoint = role === 'student' ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/login/teacher`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const token = `${data.role}|${data.user_id}|${data.email}`;

        // Store session ID in localStorage
        localStorage.setItem('session_token', token);

        // Set cookie directly in browser
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
        document.cookie = `session_token=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

        // Also call API route to set cookie on server (redundant but safer)
        try {
          await fetch('/api/auth/set-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
        } catch (err) {
          console.warn('Failed to set session cookie via API:', err);
        }

        // Create user object from login response
        const userObj: User = {
          id: data.user_id,
          email: data.email,
          name: data.name || email.split('@')[0],
          is_active: true,
          created_at: new Date().toISOString(),
          user_id: data.user_id.toString(),
          role: data.role,
        };

        setUser(userObj);

        return true;
      } else {
        const errorData = await response.json();
        console.error('Login error:', errorData.detail || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: { email: string; name: string; password: string; grade_level?: string }, role: 'student' | 'teacher'): Promise<boolean> => {
    try {
      const endpoint = role === 'student' ? `${API_BASE_URL}/auth/register` : `${API_BASE_URL}/auth/register/teacher`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Auto-login after registration
        return await login(userData.email, userData.password, role);
      } else {
        const errorData = await response.json();
        console.error('Registration error:', errorData.detail || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('session_token');
    // Remove the cookie as well
    document.cookie = 'session_token=; path=/; max-age=0';
    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}