'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider'; // Import the new AuthProvider hook
// import ResendConfirmation from '@/components/ResendConfirmation'; // Supabase specific, can be removed

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isAuthenticated, isLoading: isLoadingAuth } = useAuth(); // Use new auth context

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '' // Assuming 'name' is used as 'username' in your signup API
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState(false); // Success state managed by redirect via isAuthenticated

  // Redirect if already logged in or after successful signup
  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      const redirectPath = searchParams.get('redirect') || '/dashboard'; // Or any other default page
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoadingAuth, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the signup function from AuthProvider
      // Ensure your signup function in AuthProvider and API expects `name` as `username`
      await signup({
        email: formData.email,
        username: formData.name, // API expects username
        password: formData.password,
      });
      // On successful signup, AuthProvider updates isAuthenticated, triggering useEffect for redirect.
      // No need to set success or clear form here, redirect will handle it.
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading indicator if auth state is loading or user is already authenticated (and about to be redirected)
  if (isLoadingAuth || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }
  
  // Main signup form UI (styles largely kept from original, ensure they match login page if desired)
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
         <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/logodark.png"
            alt="Auroville"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          {/* Removed subtitle <p> */}
        </div>

        {/* Use form block styling from login */}
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
           {error && (
            // Use centered error style from login
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Apply input styling from login */}
          <div>
            <label htmlFor="name" className="sr-only"> {/* Use sr-only like login */}
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name" // Add placeholder
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only"> {/* Use sr-only like login */}
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address" // Add placeholder
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" // Note: Removed rounded-t/b here as it's middle input
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only"> {/* Use sr-only like login */}
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password" // Add placeholder
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" // Note: Removed rounded-t/b here as it's middle input
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only"> {/* Use sr-only like login */}
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password" // Add placeholder
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" // Apply rounded-b-md
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              // Use button style from login
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          {/* Use centered link style from login - Rewriting this block */}
          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-orange-500 hover:text-orange-600"
              >
                Sign in
              </Link>
            </span>
          </div>
          {/* End of centered link block */}
        </form>
      </div>
    </div> // This one closes the main container started on line 116
  );
}
