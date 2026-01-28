// Test script to validate authentication functionality
// This is a client-side test that can be run in the browser console

async function testAuthentication() {
  console.log('Testing authentication functionality...');
  
  // Test 1: Check if AuthContext is available
  if (typeof window !== 'undefined' && window.useAuth) {
    console.log('✓ AuthContext is available');
    
    // Get auth state
    const authState = window.useAuth();
    console.log('Auth state:', authState);
    
    if (authState.isAuthenticated) {
      console.log('✓ User is authenticated');
      console.log('User:', authState.user);
    } else {
      console.log('ℹ User is not authenticated');
    }
  } else {
    console.log('⚠ AuthContext is not available in global scope');
  }
  
  // Test 2: Check for auth tokens in localStorage
  const sessionToken = localStorage.getItem('session_token');

  if (sessionToken) {
    console.log('✓ Session token found in localStorage');
    // Basic validation - check if token looks like a proper session token
    if (sessionToken.length >= 32) {
      console.log('✓ Session token format appears valid');
    } else {
      console.log('⚠ Session token format is unexpected');
    }
  } else {
    console.log('ℹ No session token found in localStorage');
  }
  
  // Test 3: Check if user data is stored
  // This would typically be handled by the AuthContext
  console.log('Authentication test completed.');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAuthentication = testAuthentication;
}

console.log('Authentication test utility loaded. Run testAuthentication() in console to test.');