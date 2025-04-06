'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import { Search, Bell, Sun, Moon, Users, Filter, CirclePlus } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
// Remove old import
// import { supabase } from '@/lib/supabase';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface HeaderProps {
  user: {
    // Revert to original: email is required string, no user_metadata
    email: string; 
    name?: string; 
    role?: string;
    avatar_url?: string;
    // Remove user_metadata from here
  } | null;
  visitorCount?: number;
  siteStats?: {
    totalUsers: number;
    activeSessions: number;
  };
  showForumActions?: boolean; // New prop to toggle Forum-specific actions
}

interface Notification {
  id: string;
  title: string;
  description: string | null;
  created_at: string | null;
  type: string | null;
}

export default function Header({
  user, 
  visitorCount = 1247,
  siteStats = { totalUsers: 5432, activeSessions: 89 },
  showForumActions = false // Default to false for Dashboard page
}: HeaderProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const notificationButtonRef = useRef(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useClickOutside(notificationButtonRef, () => setIsNotificationMenuOpen(false));

  // Re-enable notification fetching
  useEffect(() => {
    const fetchNotifications = async () => {
      // Use the client component client instance
      const supabase = createClientComponentClient(); // Need to create client instance here
      const { data, error } = await supabase
        .from('events') // Assuming 'events' table now exists in types
        .select('id, title, description, created_at, type') // Removed isRead, which does not exist
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
      }
    };

    fetchNotifications();
  }, []); // Removed supabase dependency as it's created inside

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shadow-md py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="w-full sm:w-auto flex-1 max-w-2xl mb-4 sm:mb-0">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search...')}
              className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 text-sm"
            />
          </form>
        </div>

        <div className="flex items-center space-x-6 mb-4 sm:mb-0">
          <div className="flex flex-col items-center text-amber-500">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">
              {visitorCount} {t('visitors today')}
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)] mb-1">
            {siteStats.activeSessions} {t('active now')}
          </span>
        </div>

        {/* {showForumActions && (
          <div className="flex items-center space-x-2">
            <form className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                className="pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 text-sm"
              />
            </form>
            <button className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button
              className="flex items-center gap-2 bg-amber-500 text-white rounded-lg px-4 py-2 hover:bg-amber-600 transition-colors"
            >
              <CirclePlus size={16} />
              <span className="text-sm font-medium">New Topic</span>
            </button>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button> */}

        <div ref={notificationButtonRef} className="relative">
          <button
            onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
            className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
          {isNotificationMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('Notifications')}</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <a
                    key={notification.id}
                    href="#" // TODO: Link to actual event/resource?
                    className="flex items-center px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{notification.title}</p>
                      {/* Optionally display description if needed */}
                      {/* <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{notification.description}</p> */}
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {notification.created_at
                          ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })
                          : ''}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="p-4 border-t border-[var(--border-color)] text-center">
                <a href="#" className="text-sm text-[var(--text-primary)] hover:text-amber-500">
                  {t('View all notifications')}
                </a>
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-sm text-white">
                {/* Safely get initial: check name, then email, fallback */}
                {user.name ? user.name.charAt(0) : (user.email ? user.email.charAt(0) : '?')}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {/* Revert to original logic, expecting name directly on prop */}
                {user.name || user.email}
              </p>
              {/* Revert role check */}
              <p className="text-xs text-[var(--text-muted)]">{user.role || t('community_member')}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="ml-4 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {t('Sign out')}
            </button>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}
