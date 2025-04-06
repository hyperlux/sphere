'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ForumCategoryCard from '@/components/ForumCategoryCard';
import CreateTopicForm from '@/components/CreateTopicForm';
import { useAuth } from '@/components/AuthProvider';

interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export default function ForumPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [allCategories, setAllCategories] = useState<ForumCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ForumCategory[]>([]);
  const [recentTopics, setRecentTopics] = useState<any[]>([]);
  const [popularTopics, setPopularTopics] = useState<any[]>([]);
  const [pinnedTopics, setPinnedTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoriesRes = await fetch('/api/forum/categories');
        if (!categoriesRes.ok) throw new Error(`Failed to fetch categories: ${categoriesRes.statusText}`);
        const categoriesData = await categoriesRes.json();

        setAllCategories(categoriesData);
        setFilteredCategories(categoriesData);

        const allTopics: any[] = [];

        for (const category of categoriesData) {
          try {
            const topicsRes = await fetch(`/api/forum/categories/${category.id}/topics`);
            if (!topicsRes.ok) continue;
            const topicsData = await topicsRes.json();
            allTopics.push(...topicsData);
          } catch {
            continue;
          }
        }

        const pinned = allTopics.filter((t: any) => t.isPinned);
        const recent = [...allTopics].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
        const popular = [...allTopics].sort((a: any, b: any) => (b.replyCount || 0) - (a.replyCount || 0)).slice(0, 5);

        setPinnedTopics(pinned);
        setRecentTopics(recent);
        setPopularTopics(popular);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...allCategories];
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(lower) ||
        (c.description && c.description.toLowerCase().includes(lower))
      );
    }
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredCategories(filtered);
  }, [searchQuery, allCategories]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />

      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        <div className="fixed top-0 md:left-64 sm:left-20 right-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} visitorCount={1247} />
        </div>

        <Script src="/forum/forum-layout.js" strategy="afterInteractive" />
        <link rel="stylesheet" href="/forum/forum-layout.css" />

<main className="p-6 w-full pt-24 transition-all duration-300">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Forum</h1>
    <button
      onClick={() => setShowCreateModal(true)}
      disabled={allCategories.length === 0}
      className="px-4 py-2 rounded bg-[var(--auroville-teal)] text-white hover:bg-opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Create Topic
    </button>
  </div>

  {showCreateModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={() => setShowCreateModal(false)}
          className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Create New Topic</h2>
        <CreateTopicForm
          categories={allCategories}
          isLoading={isSubmitting}
          onCancel={() => setShowCreateModal(false)}
          onSubmit={async (data: { title: string; content: string; categoryId: string; tags: string[] }) => {
            setIsSubmitting(true);
            try {
              const response = await fetch(`/api/forum/categories/${data.categoryId}/topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: data.title, content: data.content, tags: data.tags })
              });
              if (!response.ok) throw new Error('Failed to create topic');
              const newTopic = await response.json();
              setRecentTopics(prev => [newTopic, ...prev]);
              setPopularTopics(prev => [newTopic, ...prev]);
              if (newTopic.isPinned) setPinnedTopics(prev => [newTopic, ...prev]);
              setShowCreateModal(false);
            } catch (err) {
              console.error(err);
              alert('Failed to create topic');
            } finally {
              setIsSubmitting(false);
            }
          }}
          categoryId={''} // prevent internal redirect
        />
      </div>
    </div>
  )}

  <div className="mb-6">
    <input
      type="text"
      placeholder="Search categories and topics..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full max-w-md px-4 py-2 rounded border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--auroville-teal)] transition"
    />
  </div>

  {isLoading ? (
    <div className="text-center py-12 text-[var(--text-muted)]">Loading forum data...</div>
  ) : error ? (
    <div className="text-center py-12 text-red-500">Error loading forum data: {error}</div>
  ) : (
    <>
      {pinnedTopics.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Announcements</h2>
          <div className="flex flex-col gap-4">
            {pinnedTopics.map((topic) => (
              <a key={topic.id} href={`/forum/topics/${topic.id}`} className="block rounded-lg border border-[var(--border-color)] hover:shadow-lg hover:border-orange-400 transition p-4">
                <h3 className="font-semibold text-[var(--text-primary)]">{topic.title}</h3>
                <p className="text-[var(--text-secondary)] line-clamp-2">{topic.content}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {recentTopics.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Recent Discussions</h2>
          <div className="flex flex-col gap-4">
            {recentTopics.map((topic) => (
              <a key={topic.id} href={`/forum/topics/${topic.id}`} className="block rounded-lg border border-[var(--border-color)] hover:shadow-lg hover:border-[var(--auroville-teal)] transition p-4">
                <h3 className="font-semibold text-[var(--text-primary)]">{topic.title}</h3>
                <p className="text-[var(--text-secondary)] line-clamp-2">{topic.content}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {popularTopics.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Popular Topics</h2>
          <div className="flex flex-col gap-4">
            {popularTopics.map((topic) => (
              <a key={topic.id} href={`/forum/topics/${topic.id}`} className="block rounded-lg border border-[var(--border-color)] hover:shadow-lg hover:border-amber-400 transition p-4">
                <h3 className="font-semibold text-[var(--text-primary)]">{topic.title}</h3>
                <p className="text-[var(--text-secondary)] line-clamp-2">{topic.content}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Categories</h2>
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)] text-lg">
              {searchQuery ? 'No categories found matching your search.' : 'No categories found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
{filteredCategories.map((category) => (
  <ForumCategoryCard
    key={category.id}
    id={category.id}
    name={category.name}
    description={category.description ?? ''}
    icon={category.icon ?? '💬'}
  />
))}
          </div>
        )}
      </section>
    </>
  )}
</main>
      </div>
    </div>
  );
}
