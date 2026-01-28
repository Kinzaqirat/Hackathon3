import { cookies } from 'next/headers';

// Define the shape of our user object
interface UserData {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'teacher';
}

/**
 * Server-side function to check if user is authenticated
 * @returns User data if authenticated, null otherwise
 */
export async function getServerAuthSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return null;
    }

    // Make an API call to the backend to verify the session token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
      headers: {
        'X-Session-ID': token,
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Ensure fresh data
    });

    if (!response.ok) {
      return null;
    }

    const userData: UserData = await response.json();

    return {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
      token
    };
  } catch (error) {
    console.error('Error verifying session token:', error);
    return null;
  }
}

/**
 * Server-side function to check if user is authenticated and has required role
 * @param requiredRole The role required to access the resource
 * @returns True if user is authenticated with required role, false otherwise
 */
export async function requireAuth(requiredRole?: 'student' | 'teacher') {
  const session = await getServerAuthSession();
  
  if (!session) {
    return false;
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return false;
  }

  return true;
}