'use client';

import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navigation from '@/components/Navigation';
import InstallPrompt from '@/components/InstallPrompt';
import NotificationPrompt from '@/components/NotificationPrompt';
import NetworkStatus from '@/components/NetworkStatus';
import { ToastProvider } from '@/components/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Suspense, useEffect } from 'react';
import '../lib/i18n';
import { useTranslation } from 'react-i18next';

// Validate Supabase environment variables at module load time
if (typeof window === 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Load preferred language from localStorage
    const loadPreferredLanguage = async () => {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage && savedLanguage !== i18n.language) {
        try {
          await i18n.changeLanguage(savedLanguage);
          document.documentElement.lang = savedLanguage;
        } catch (error) {
          console.error('Error loading preferred language:', error);
        }
      }
    };

    loadPreferredLanguage();
  }, [i18n]);

  // Handle language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>AuroNet</title>
        <meta name="description" content="Auroville's Digital Community Platform" />
        <link rel="manifest" href="/manifest.json" />
        {/* PWA meta tags */}
        <meta name="application-name" content="AuroNet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AuroNet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#F97316" />

        {/* Favicon will be automatically handled by Next.js via app/icon.png */}
        {/* Removed manual link tags:
          <link rel="apple-touch-icon" href="favicon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon.png" />
        */}
      </head>
      <body className="antialiased">
        <Suspense fallback={<div className="min-h-screen bg-gray-900"></div>}>
          <ToastProvider>
            <ThemeProvider>
              <AuthProvider>
                <NetworkStatus />
                <div className="flex flex-col md:flex-row min-h-screen w-full">
                  {children}
                </div>
                <InstallPrompt />
                <NotificationPrompt />
              </AuthProvider>
            </ThemeProvider>
          </ToastProvider>
        </Suspense>
      </body>
    </html>
  );
}
