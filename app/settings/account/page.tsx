'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';

export default function AccountSettingsPage() {
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
            {t('account settings')}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {t('manage your account settings here')}
          </p>
          <div className="mt-8">
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)]">
                  {t('name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  // Add value and onChange handlers here later
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)]">
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  // Add value and onChange handlers here later
                />
              </div>
              {/* Add submit button here later */}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}