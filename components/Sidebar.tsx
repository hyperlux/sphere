'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user: {
    email: string;
    name?: string;
  } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navigation = [
    { name: 'dashboard', href: '/dashboard', icon: '🗂️' },
    { name: 'forums', href: '/community', icon: '💬' },
    { name: 'events_page', href: '/events', icon: '📅' },
    { name: 'bazaar', href: '/bazaar', icon: '🛒' },
    { name: 'services', href: '/services', icon: '🔧' },
    { name: 'resources_page', href: '/resources', icon: '📚' },
    { name: 'settings', href: '/settings', icon: '⚙️' },
  ];

  const externalLinks = [
    { name: 'auroville_foundation', href: 'https://auroville.org', icon: '🔗' },
    { name: 'directory', href: '/directory', icon: '📖' },
    { name: 'media_portal', href: '/media', icon: '📰' },
    { name: 'wiki', href: '/wiki', icon: '📝' },
  ];

  return (
    <aside className="w-64 bg-[var(--bg-secondary)] fixed h-full flex flex-col border-r border-[var(--border-color)]">
      <div className="flex items-center py-4 px-4">
        <img src="/logodark.png" alt="Auroville.COMMUNITY" width={160} height={50} className="mr-auto" />
      </div>

      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
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
                  className="flex items-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2 px-2"
                >
                  <span className="mr-3">{link.icon}</span>
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
