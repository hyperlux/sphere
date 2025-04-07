'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import CreateTopicForm from '@/components/CreateTopicForm';
import { jwtDecode } from 'jwt-decode';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/db/database.types';

// Define structure for category list
interface CategoryInfo {
  id: string;
  name: string;
}

export default function NewTopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth(); // Check if user is logged in

  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get initial category ID from query params if present
  const initialCategoryId = searchParams.get('categoryId') || '';

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setError(null);
      try {
        const response = await fetch('/api/forum/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        const data: CategoryInfo[] = await response.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Could not load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission - calls the API route
  const handleCreateTopicSubmit = useCallback(async (formData: {
    title: string;
    content: string;
    categoryId: string;
    tags: string[]; // Tags are collected but not yet used by the API
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClientComponentClient<Database>();
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        console.warn('No Supabase session found');
      } else {
        const accessToken = sessionData.session.access_token;
        console.log('Supabase Access Token:', accessToken);

        try {
          const decoded: any = jwtDecode(accessToken);
          console.log('Decoded JWT:', decoded);
        } catch (err) {
          console.error('JWT decode error:', err);
        }

        const response = await fetch(`/api/forum/categories/${formData.categoryId}/topics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            categoryId: formData.categoryId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to create topic: ${response.statusText}`);
        }

        const newTopic = await response.json();
        router.push(`/forum/topics/${newTopic.id}`);
        return;
      }

      // If no session, fallback to unauthenticated request (will likely fail)
      const response = await fetch(`/api/forum/categories/${formData.categoryId}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          categoryId: formData.categoryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create topic: ${response.statusText}`);
      }

      const newTopic = await response.json();
      router.push(`/forum/topics/${newTopic.id}`);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to create topic. Please try again.');
      setIsSubmitting(false);
      throw err;
    }
  }, [router]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      // Maybe show a message before redirecting?
      router.push('/login?redirect=/forum/topics/new');
    }
  }, [user, router]);

  if (!user) {
     // Render loading or null while redirecting
     return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />

      <main className="flex-1 p-6 container mx-auto max-w-3xl">
        <div className="mb-6">
           <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-3">
              <ArrowLeft size={16} />
              Back
           </button>
           {/* Title is handled within the form component */}
        </div>

        {isLoadingCategories ? (
          <div className="text-center py-12 flex justify-center items-center gap-2 text-[var(--text-muted)]">
            <Loader2 className="animate-spin" size={20} /> Loading form...
          </div>
        ) : error && categories.length === 0 ? ( // Show error only if categories failed to load
          <div className="text-center py-12 text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/30">
             <AlertCircle size={24} className="mx-auto mb-2" />
             Error loading categories: {error}. Cannot create a topic.
          </div>
        ) : (
          <CreateTopicForm
            categories={categories}
            onSubmit={handleCreateTopicSubmit}
            onCancel={() => router.back()}
            categoryId={initialCategoryId}
            isLoading={isSubmitting}
          />
        )}
      </main>
    </div>
  );
}
