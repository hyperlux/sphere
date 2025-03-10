'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';

export default function ServicesPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">{t('loading')}...</div>;
  }

  if (!user) {
    return <RedirectToLogin />;
  }

  const userDisplayInfo = user ? {
    email: user.email || 'No email',
    name: user.user_metadata?.name || undefined
  } : null;

  return (
    <div className="min-h-screen">
      <Sidebar user={userDisplayInfo} />
      <Header user={userDisplayInfo} />
      
      <main className="ml-64 pt-16 p-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mt-8">
          {t('services')}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {t('find local services in Auroville')}
        </p>

        {/* Add services content here */}
        <div className="mt-8 space-y-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {t('plumbing')}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('find a local plumber')}
            </p>
            {/* Add plumbing services list here */}
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {t('electrical')}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('find a local electrician')}
            </p>
            {/* Add electrical services list here */}
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {t('gardening')}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('find a local gardener')}
            </p>
            {/* Add gardening services list here */}
          </div>
        </div>
      </main>
    </div>
  );
}
