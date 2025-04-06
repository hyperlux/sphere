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
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  user: {
    // Revert to original: email is required string, no user_metadata
    email: string; 
    name?: string;
    // Remove user_metadata
  } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { theme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Forums', href: '/forum', icon: MessageSquare },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Bazaar', href: '/bazaar', icon: ShoppingBag },
    { name: 'Services', href: '/services', icon: Building2 },
    { name: 'Resources', href: '/resources', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const externalLinks = [
    { name: 'auroville_foundation', href: 'https://auroville.org', icon: ExternalLink },
    { name: 'directory', href: '/directory', icon: ExternalLink },
    { name: 'media_portal', href: '/media', icon: ExternalLink },
    { name: 'wiki', href: '/wiki', icon: ExternalLink },
  ];

  return (
    <aside className="w-64 bg-[var(--bg-secondary)] fixed h-full flex flex-col border-r border-[var(--border-color)] overflow-x-hidden transition-all duration-300 z-40 rounded-r-2xl shadow-lg">
      <div className="flex items-center py-2 pl-5 pb-5 border-b border-[var(--border-color)]">
        <Link href="/dashboard">
          <Image 
            src={theme === 'dark' ? '/logodark.png' : '/logolight.png'} 
            alt="Auroville.COMMUNITY" 
            width={200} 
            height={120} 
            className="mr-auto" 
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 pb-4">
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

      {user && (
        <div className="p-4 mt-auto border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] rounded-t-xl shadow-inner">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-sm text-white">
                {/* Safely get initial: check name, then email, fallback */}
                {user.name ? user.name.charAt(0) : (user.email ? user.email.charAt(0) : '?')}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {/* Revert to original logic */}
                {user.name || 'Test Admin'} 
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {t('community_member')}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
