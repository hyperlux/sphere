'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';
import { User } from '@supabase/supabase-js'; // Import User type

// Remove getUserDisplayInfo function

export default function ServicesPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  // Remove userDisplayInfo variable

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">{t('loading')}...</div>; // Added flex centering
  }

  // Update check to only use user
  if (!user) { 
    return <RedirectToLogin />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Pass simplified user object */}
      <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        {/* Wrap Header in fixed div */}
        <div className="fixed top-0 md:left-64 sm:left-20 right-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          {/* Pass simplified user object */}
          <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
        </div>
        {/* Add padding-top and flex-1 to main */}
        <main className="flex-1 p-6 w-full pt-24 transition-all duration-300"> 
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {t('Services')}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {t('find local services in Auroville')}
          </p>

          <div className="mt-8 space-y-4">
            <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {t('plumbing')}
              </h2>
              <p className="text-[var(--text-secondary)]">
                {t('find a local plumber')}
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {t('electrical')}
              </h2>
              <p className="text-[var(--text-secondary)]">
                {t('find a local electrician')}
              </p>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {t('gardening')}
              </h2>
              <p className="text-[var(--text-secondary)]">
                {t('find a local gardener')}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} // End of component function
