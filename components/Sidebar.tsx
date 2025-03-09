'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user: {
    email: string;
    name?: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navigation = [
    { name: 'dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'community', href: '/community', icon: '👥' },
    { name: 'events_page', href: '/events', icon: '📅' },
    { name: 'resources_page', href: '/resources', icon: '📚' },
  ];

  const externalLinks = [
    { name: 'official_website', href: 'https://auroville.org' },
    { name: 'directory', href: '/directory' },
  ];

  return (
    <aside className="w-64 p-4 bg-gray-800 fixed h-full flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-3">
          A
        </div>
        <span className="text-xl font-bold text-orange-500">AuroNet</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                {t(item.name)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <h3 className="text-sm uppercase text-gray-400 mb-2">{t('external_resources')}</h3>
          <ul className="space-y-2">
            {externalLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors block py-1"
                >
                  {t(link.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="pt-4 mt-auto border-t border-gray-700">
        <div className="flex items-center">
          <div className="avatar">
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-200">
              {user.name || user.email}
            </p>
            <p className="text-xs text-gray-400">
              {t('community_member')}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
