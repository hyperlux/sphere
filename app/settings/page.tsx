'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';

export default function SettingsPage() {
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
    <div className="min-h-screen bg-[var(--bg-primary)]"> {/* Added bg-primary like dashboard */}
      <Sidebar user={userDisplayInfo} />
      {/* Added wrapper div with margin-left like dashboard */}
      <div className="flex flex-col min-h-screen ml-64 transition-all duration-300"> 
        <Header user={userDisplayInfo} />
        
        {/* Adjusted main classes to match dashboard: removed pl-80, pt-24, max-w-5xl, added w-full */}
        <main className="p-6 w-full transition-all duration-300"> 
          {/* Removed mt-8 from h1 as p-6 provides top padding */}
          <h1 className="text-3xl font-bold text-[var(--text-primary)]"> 
            {t('settings')}
          </h1>
        <p className="text-[var(--text-secondary)]">
          {t('manage your account settings here')}
        </p>

        {/* Add settings options here */}
        <div className="mt-8 space-y-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {t('account settings')}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('update your profile information')}
            </p>
            {/* Add account settings form or options here */}
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {t('notification settings')}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('manage your email and push notifications')}
            </p>
            {/* Add notification settings form or options here */}
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {t('privacy settings')}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('control your data sharing preferences')}
            </p>
            {/* Add privacy settings form or options here */}
          </div>
        </div>
      </main>
    </div>
  </div>
  );
}
