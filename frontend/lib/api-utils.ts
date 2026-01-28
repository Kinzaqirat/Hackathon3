/**
 * API utility functions with authentication support
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/**
 * Get the session token from localStorage
 */
function getSessionToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('session_token');
  }
  return null;
}

/**
 * Make an authenticated API request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getSessionToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'X-Session-ID': token }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  return fetch(url, config);
}

/**
 * Make an authenticated API request and parse JSON response
 */
export async function authenticatedJsonFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await authenticatedFetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, url: ${url}`);
  }
  
  return response.json();
}

export { API_BASE_URL };