'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import HeroCarousel from '@/components/HeroCarousel';
import QuickStats from '@/components/QuickStats';
import InfoSections from '@/components/InfoSections';
import WelcomeFooter from '@/components/WelcomeFooter';

export default function WelcomePage() {
  const { session, loading } = useAuth(); // Use session and loading state
  const router = useRouter(); // Use Next.js router

  useEffect(() => {
    // Redirect to dashboard if user is authenticated (session exists and loading is done)
    if (!loading && session) {
      router.replace('/dashboard'); // Use router.replace and updated path
      return;
    }
  }, [session, loading, router]); // Added session and loading to dependencies

  // Render null or a loading indicator while checking auth, before showing the page
  if (loading || session) {
     // Don't render the welcome page if loading or already authenticated (and redirecting)
     // You might want a loading spinner here instead of null
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] w-full">
      <HeroCarousel />
      <QuickStats />
      <InfoSections />
      <WelcomeFooter />
    </div>
  );
}
