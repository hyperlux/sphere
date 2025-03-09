'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import LanguageSelector from '@/components/LanguageSelector';

interface HeaderProps {
  user: {
    email: string;
    name?: string;
  };
  visitorCount?: number;
}

export default function Header({ user }: HeaderProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <input
          type="search"
          placeholder={t('search_placeholder')}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <LanguageSelector />

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="avatar">
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-200">
              {user.name || user.email}
            </p>
            <button
              onClick={() => signOut()}
              className="text-xs text-orange-500 hover:text-orange-400 text-left"
            >
              {t('sign_out')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
