'use client';

import { useEffect } from 'react';

/**
 * Component to synchronize authentication token between localStorage and cookies
 * This ensures that both the client-side auth context and server-side middleware
 * can access the authentication token
 */
export default function TokenSync() {
  useEffect(() => {
    // Function to sync token from localStorage to cookie
    const syncTokenToCookie = () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('session_token');
        
        if (token) {
          // Set the token in a cookie with a 24-hour expiration
          document.cookie = `session_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
        } else {
          // If no token in localStorage, remove the cookie
          document.cookie = 'session_token=; path=/; max-age=0';
        }
      } catch (error) {
        console.error('Error syncing token to cookie:', error);
      }
    };

    // Sync immediately on mount
    syncTokenToCookie();

    // Listen for storage events to sync when token changes in other tabs/windows
    window.addEventListener('storage', syncTokenToCookie);

    // Also check periodically (every 5 seconds) for any changes
    const intervalId = setInterval(syncTokenToCookie, 5000);

    // Cleanup event listener and interval
    return () => {
      window.removeEventListener('storage', syncTokenToCookie);
      clearInterval(intervalId);
    };
  }, []);

  return null; // This component doesn't render anything
}