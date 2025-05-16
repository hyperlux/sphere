'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { 
  LayoutGrid, 
  MessageSquare, 
  Calendar, 
  ShoppingBag, 
  Building2, 
  FileText, 
  Settings,
  ExternalLink,
  LogIn,      // For login link
  UserPlus    // For signup link
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider'; // Import useAuth

// SidebarProps is removed as 'user' prop is no longer passed directly

export default function Sidebar() { // user prop removed
  const { t } = useTranslation();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth(); // Get auth state

  // Define navigation items with an optional authRequired flag
  const allPossibleNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid, authRequired: true },
    { name: 'Forums', href: '/forum', icon: MessageSquare, authRequired: false },
    { name: 'Events', href: '/events', icon: Calendar, authRequired: false },
    { name: 'Bazaar', href: '/bazaar', icon: ShoppingBag, authRequired: false },
    { name: 'Services', href: '/services', icon: Building2, authRequired: false },
    { name: 'Resources', href: '/resources', icon: FileText, authRequired: false },
    { name: 'Settings', href: '/settings', icon: Settings, authRequired: true },
    // Add Login and Sign Up links conditionally
    { name: 'Login', href: '/login', icon: LogIn, showIfNotAuthenticated: true },
    { name: 'Sign Up', href: '/signup', icon: UserPlus, showIfNotAuthenticated: true },
  ];

  const navigation = allPossibleNavigation.filter(item => {
    if (item.authRequired) return isAuthenticated;
    if (item.showIfNotAuthenticated) return !isAuthenticated;
    return true; // For items that are always shown or don't have auth conditions
  });

  const externalLinks = [
    { name: 'auroville_foundation', href: 'https://auroville.org', icon: ExternalLink },
  ];

  return (
    <aside className="w-64 bg-[var(--bg-secondary)] fixed top-28 left-0 flex flex-col border-r border-[var(--border-color)] overflow-x-hidden transition-all duration-300 z-40 rounded-r-2xl rounded-b-2xl rounded-tl-2xl shadow-lg">
      <div className="flex items-center py-2 pl-5 pb-5">
        {/* Placeholder for potential user avatar/name in sidebar header */}
      </div>

      <nav className="flex-1 px-4 py-2 pb-4">
        {isLoadingAuth ? (
          <div className="animate-pulse px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-[var(--bg-tertiary)] rounded-md my-2"></div>
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
className={`flex items-center text-sm py-2 px-2 rounded-lg transition-colors ${
  pathname === item.href 
    ? 'bg-amber-500 text-white' 
    : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:shadow-md hover:ring-1 hover:ring-amber-400'
}`}
              >
                <span className="mr-3">
                  {React.createElement(item.icon, { size: 20 })}
                </span>
                {t(item.name)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <h3 className="text-xs uppercase text-[var(--text-muted)] font-medium tracking-wider mb-3 px-2">
            {t('external_resources')}
          </h3>
          <ul className="space-y-1">
            {externalLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
className={`flex items-center text-sm py-2 px-2 rounded-lg transition-colors ${
  pathname === link.href 
    ? 'bg-amber-500 text-white' 
    : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:shadow-md hover:ring-1 hover:ring-amber-400'
}`}
                >
                  <span className="mr-3">
                    {React.createElement(link.icon, { size: 20 })}
                  </span>
                  {t(link.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

    </aside>
  );
}
