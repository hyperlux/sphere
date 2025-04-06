'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';
import { User } from '@supabase/supabase-js'; // Import User type

// Helper function to get display info
function getUserDisplayInfo(user: User | null) {
  if (!user) return null;
  return {
    email: user.email || 'No email',
    name: user.user_metadata?.name || undefined
  };
}


export default function ServicesPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  const userDisplayInfo = getUserDisplayInfo(user); // Use helper function

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">{t('loading')}...</div>; // Added flex centering
  }

  if (!user || !userDisplayInfo) { // Check userDisplayInfo as well
    return <RedirectToLogin />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={userDisplayInfo} />
      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        <Header user={userDisplayInfo} />
        <main className="p-6 w-full transition-all duration-300">
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
