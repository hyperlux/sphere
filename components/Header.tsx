'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import { Search, Bell, Sun, Moon, Users } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface HeaderProps {
  user: {
    email: string;
    name?: string;
  } | null;
  visitorCount?: number;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function Header({ user, visitorCount = 1247 }: HeaderProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const notificationButtonRef = useRef(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useClickOutside(notificationButtonRef, () => {
    setIsNotificationMenuOpen(false);
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header className="sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between py-3 px-4 sm:px-6 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shadow-md transition-all duration-300">
      <div className="w-full sm:w-auto flex-1 max-w-2xl mb-4 sm:mb-0 pl-3 pt-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder={t('Search')}
            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex items-center mx-2 sm:mx-4 text-amber-500 mb-4 sm:mb-0">
        <Users className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">{visitorCount} {t('visitors today')}</span>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={toggleTheme}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <div ref={notificationButtonRef} className="relative">
          <button
            onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>

          {isNotificationMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden z-20">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] divide-y divide-[var(--border-color)]">
                {notifications.map((notification) => (
                  <a
                    key={notification.id}
                    href="#"
                    className="flex items-center px-4 py-3 hover:bg-[var(--bg-primary)] transition-colors duration-150"
                  >
                    <div className="pl-3">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {notification.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </a>
                ))}
                <div className="py-2 text-center">
                  <a
                    href="#"
                    className="block text-sm text-[var(--text-primary)] hover:text-orange-500 transition-colors duration-200"
                  >
                    {t('See all notifications')}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-sm text-white">
                {user.name ? user.name.charAt(0) : user.email.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col hidden sm:block">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user.name || user.email}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{t('community_member')}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => signOut()}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {t('sign_out')}
        </button>
      </div>
    </header>
  );
}
