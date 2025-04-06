'use client';

import { useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import React from 'react';

export default function Forum2Page() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />

      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        <div className="fixed top-0 md:left-64 sm:left-20 right-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} visitorCount={1247} />
        </div>

        <main className="p-6 w-full pt-24 transition-all duration-300">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Forum 2</h1>
          <p className="text-[var(--text-secondary)]">This is a new forum page with the same layout as the dashboard.</p>
        </main>
      </div>
    </div>
  );
}
