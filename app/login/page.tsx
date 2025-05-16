'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Use Next.js hooks
import Link from 'next/link'; // Use Next.js Link
import { useAuth } from '@/components/AuthProvider'; // Corrected import path

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isLoading to avoid conflict
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to get query parameters
  // Use the new properties from useAuth
  const { login, isAuthenticated, isLoading: isLoadingAuth } = useAuth(); 

  // Redirect if already logged in
  useEffect(() => {
    // Check isAuthenticated and ensure auth loading is complete
    if (!isLoadingAuth && isAuthenticated) {
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoadingAuth, router, searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true); // Use isSubmitting for form state

    try {
      await login({ email, password }); // Call the new login function
      // AuthProvider's login will update isAuthenticated, triggering the useEffect for redirect.
      // If not, an explicit redirect can be placed here after successful auth context update.
      // For now, relying on AuthProvider and useEffect.
      // Optionally: router.replace(searchParams.get('redirect') || '/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render the form if auth state is loading or user is already authenticated
  if (isLoadingAuth || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    // Add w-full here to ensure this container takes full width within the parent layout's flex context
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/logodark.png" // Assuming logo in public folder
            alt="Auroville"
          />
          {/* Title already centered */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" // Updated styles
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" // Updated styles
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Center "Forgot password" link */}
          <div className="text-sm text-center">
            <Link
              href="/forgot-password" // Use Next.js Link href
                className="font-medium text-orange-500 hover:text-orange-600" // Updated styles
              >
                Forgot your password?
            </Link>
          </div>


          <div>
            <button
              type="submit"
              disabled={isSubmitting} // Use isSubmitting for form disabled state
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${ // Updated styles
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/signup" // Use Next.js Link href (assuming signup page exists)
                className="font-medium text-orange-500 hover:text-orange-600" // Updated styles
              >
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
