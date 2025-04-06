'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ForumTopicCard from '@/components/ForumTopicCard';
import CreateTopicForm from '@/components/CreateTopicForm';
import { useAuth } from '@/components/AuthProvider';

interface Category {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  replyCount: number;
  viewCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  lastReply?: {
    author: {
      id: string;
      name: string;
    };
    timestamp: string;
  };
  mood?: 'default' | 'question' | 'announcement' | 'discussion' | 'solved';
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [topicsRes, categoriesRes] = await Promise.all([
          fetch(`/api/forum/categories/${categoryId}/topics`),
          fetch('/api/forum/categories')
        ]);

        if (!topicsRes.ok) throw new Error(`Failed to fetch topics: ${topicsRes.statusText}`);
        if (!categoriesRes.ok) throw new Error(`Failed to fetch categories: ${categoriesRes.statusText}`);

        const topicsData = await topicsRes.json();
        const categoriesData = await categoriesRes.json();

        setTopics(topicsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const handleCreateTopic = async (data: { title: string; content: string; categoryId: string; tags: string[] }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/forum/categories/${data.categoryId}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          tags: data.tags
        })
      });
      if (!response.ok) throw new Error(`Failed to create topic: ${response.statusText}`);
      const newTopic = await response.json();
      setTopics(prev => [newTopic, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />

      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        <div className="fixed top-0 md:left-64 sm:left-20 right-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} visitorCount={1247} />
        </div>

        <main className="p-6 w-full pt-24 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Topics</h1>
            {user && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 rounded bg-[var(--auroville-teal)] text-white hover:bg-opacity-80 transition"
              >
                {showCreateForm ? 'Cancel' : 'Create Topic'}
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="mb-6">
              <CreateTopicForm
                categoryId={categoryId as string}
                categories={categories}
                isLoading={isSubmitting}
                onCancel={() => setShowCreateForm(false)}
                onSubmit={handleCreateTopic}
              />
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12 text-[var(--text-muted)]">Loading topics...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Error loading topics: {error}</div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">No topics found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {topics.map((topic) => (
                <ForumTopicCard key={topic.id} {...topic} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
