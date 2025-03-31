'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = window.location.hash;
        if (!hash) {
          router.push('/login?error=no_token');
          return;
        }

        // Parse the hash fragment
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (!access_token || !refresh_token) {
          router.push('/login?error=invalid_tokens');
          return;
        }

        // Set the session
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=session_failed');
        } else if (data.session) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Callback error:', err);
        router.push('/login?error=unknown');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Completing authentication...</h2>
        <p className="text-gray-600 dark:text-gray-300">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}
