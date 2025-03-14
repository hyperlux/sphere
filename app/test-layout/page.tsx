'use client';

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function TestLayoutPage() {
  // Mock user data to pass to components
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={mockUser} />
      <Header user={mockUser} visitorCount={1247} />
      
      <main className="ml-0 md:ml-64 sm:ml-20 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Test Layout Page</h1>
          <p className="text-[var(--text-primary)] mb-4">
            This page is used to test the layout and alignment of components.
          </p>
          <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
              Logo Alignment Test
            </h2>
            <p className="text-[var(--text-primary)]">
              Check if the logo in the sidebar is properly aligned with the search bar in the header.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
