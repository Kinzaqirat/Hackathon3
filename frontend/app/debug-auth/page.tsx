'use client';

import { useAuth } from '@/lib/auth-context';
import { API_BASE_URL } from '@/lib/api-utils';
import { useState } from 'react';

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const checkToken = () => {
    const token = localStorage.getItem('session_token');
    const cookieToken = document.cookie.split(';').find(c => c.includes('session_token'));

    setTokenInfo({
      localStorage: token,
      cookie: cookieToken,
      userState: { user, isAuthenticated, isLoading }
    });
  };

  const testApiCall = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'X-Session-ID': token || '',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setApiResponse({ status: response.status, data });
    } catch (error) {
      setApiResponse({ error: String(error) });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>

      <button
        onClick={checkToken}
        className="px-4 py-2 bg-blue-500 text-white rounded mr-2 mb-4"
      >
        Check Token
      </button>

      <button
        onClick={testApiCall}
        className="px-4 py-2 bg-green-500 text-white rounded mb-4"
      >
        Test API Call
      </button>

      {tokenInfo && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Token Info:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(tokenInfo, null, 2)}</pre>
        </div>
      )}

      {apiResponse && (
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">API Response:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
