'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import LanguageSelector from '@/components/LanguageSelector';
import { useTheme } from '@/components/ThemeProvider';
import { Search, Bell, Sun, Moon, Users } from 'lucide-react';

interface HeaderProps {
  user: {
    email: string;
    name?: string;
  } | null;
  visitorCount?: number;
}

export default function Header({ user, visitorCount = 1247 }: HeaderProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 right-0 left-64 h-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-6 flex items-center justify-between z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="search"
          placeholder={t('search_placeholder')}
          className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Visitor Count */}
      <div className="flex items-center mx-6 text-amber-500">
        <Users className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">{visitorCount} {t('visitors_today')}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
        </button>

        {/* Notifications */}
        <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <Bell className="w-6 h-6" />
        </button>

        {/* User Menu */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="avatar bg-amber-500">
              <span className="text-sm">TA</span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user.name || 'Test Admin'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {t('community_member')}
              </p>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={() => signOut()}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] ml-2"
        >
          {t('sign_out')}
        </button>
      </div>
    </header>
  );
}
