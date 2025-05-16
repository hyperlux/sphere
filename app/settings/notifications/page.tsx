'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';

export default function NotificationSettingsPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">{t('loading')}...</div>;
  }

  if (!user) {
    return <RedirectToLogin />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        <div className="fixed top-0 md:left-64 sm:left-20 right-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
        </div>
        <main className="flex-1 p-6 w-full pt-24 transition-all duration-300">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {t('notification settings')}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {t('manage your email and push notifications')}
          </p>
          {/* Notification settings form or options will go here */}
        </main>
      </div>
    </div>
  );
}