;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;'use client';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

export default function TestPage() {
  // Mock user for testing
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  return (
    <ThemeProvider>
      <TestContent user={mockUser} />
    </ThemeProvider>
  );
}

function TestContent({ user }: { user: { email: string; name?: string } }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={user} />
      <Header user={user} visitorCount={1247} />
      
      <main className="ml-64 pt-24 p-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Theme Test Page</h1>
        
        <div className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
          <h2 className="text-xl font-semibold text-[var(--text-secondary)] mb-4">Current Theme: {theme}</h2>
          
          <p className="mb-4 text-[var(--text-primary)]">
            This page is for testing the theme toggle and logo switching functionality.
          </p>
          
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Toggle Theme ({theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})
          </button>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">Current Logo:</h3>
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
              <p className="text-[var(--text-primary)] mb-2">
                In {theme} mode, the application is using:
              </p>
              <code className="block p-2 bg-[var(--bg-primary)] rounded text-[var(--text-secondary)]">
                {theme === 'dark' ? '/logolight.png' : '/logodark.png'}
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
