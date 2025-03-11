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
    email: string;
    name?: string;
  } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { theme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Forums', href: '/community', icon: MessageSquare },
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
    <aside className="w-64 bg-[var(--bg-secondary)] fixed h-full flex flex-col border-r border-[var(--border-color)]">
      <div className="flex items-center py-4 pl-7">
        <img 
          src={theme === 'dark' ? '/logodark.png' : '/logolight.png'} 
          alt="Auroville.COMMUNITY" 
          width={200} 
          height={100} 
          className="mr-auto" 
        />
      </div>

      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''} text-[var(--text-primary)]`}
              >
                <span className="mr-3 text-[var(--text-primary)]">
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
                  className="flex items-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2 px-2 text-[var(--text-primary)]"
                >
                  <span className="mr-3 text-[var(--text-muted)]">
                    {React.createElement(link.icon, { size: 16 })}
                  </span>
                  {t(link.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {user && (
        <div className="p-4 mt-auto border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]">
          <div className="flex items-center">
            <div className="avatar bg-amber-500">
              <span className="text-sm">TA</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">
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
