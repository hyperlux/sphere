'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return user ? (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-amber-600">AuroNet</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/dashboard"
                className="border-amber-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleSignOut}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  ) : null;
}
