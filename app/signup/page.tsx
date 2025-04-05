'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ResendConfirmation from '@/components/ResendConfirmation'; // Keep this if used in success message

export default function SignUpPage() { // Renamed component for clarity
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        setSuccess(true);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: ''
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Apply dark theme styling to the success message
  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
           <img
            className="mx-auto h-12 w-auto"
            src="/logodark.png"
            alt="Auroville"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Check your email
          </h2>
          <div className="mt-8 bg-transparent py-8 px-4 sm:px-10"> {/* Removed white bg and shadow */}
            <div className="text-center">
              <p className="mb-4 text-gray-300"> {/* Adjusted text color */}
                We've sent a confirmation link to <strong className="text-orange-500">{/* Use original email state if needed, or remove if not available */}</strong>
              </p>
              <p className="text-sm text-gray-400 mb-4"> {/* Adjusted text color */}
                Click the link in your email to complete your registration.
              </p>
              {/* Consider if ResendConfirmation needs dark theme styling */}
              {/* <ResendConfirmation email={formData.email} /> */}
              <button
                onClick={() => router.push('/login')}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" // Use orange button style
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Apply dark theme styling and layout matching login page
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
              disabled={loading}
              // Use button style from login
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating account...' : 'Create account'}
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
