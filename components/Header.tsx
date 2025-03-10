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

export default function Header({ user, visitorCount = 1247 }: HeaderProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-[#1E293B] border-b border-gray-700 px-6 flex items-center justify-between z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="search"
          placeholder={t('search_placeholder')}
          className="w-full pl-10 pr-4 py-2 bg-[#111827] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Visitor Count */}
      <div className="flex items-center mx-6 text-amber-500">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
        </svg>
        <span className="text-sm font-medium">{visitorCount} {t('visitors_today')}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>

        {/* Notifications */}
        <button className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="avatar bg-amber-500">
            <span className="text-sm">TA</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-200">
              {user.name || 'Test Admin'}
            </p>
            <p className="text-xs text-gray-400">
              {t('community_member')}
            </p>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-300 hover:text-white ml-2"
        >
          {t('sign_out')}
        </button>
      </div>
    </header>
  );
}
