'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import ForumTopicCard from '@/components/ForumTopicCard'; // Assuming this component exists or will be created
import { formatDistanceToNow } from 'date-fns'; // For relative timestamps

// Define the structure for a topic based on API response
interface ForumTopic {
  id: string;
  title: string;
  createdAt: string;
  lastActivityAt: string;
  category: {
    id: string | null;
    name: string | null;
  };
  author: {
    id: string | null;
    name: string; // Username is mapped to name in API
  };
  // Add postCount later if API provides it
}

export default function CategoryTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const categoryId = params.categoryId as string;

  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchTopics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/forum/categories/${categoryId}/topics`);
        if (!response.ok) {
          if (response.status === 404) {
             throw new Error(`Category not found.`);
          }
          throw new Error(`Failed to fetch topics: ${response.statusText}`);
        }
        const data: ForumTopic[] = await response.json();
        setTopics(data);
        // Set category name from the first topic's data (assuming all topics belong to the same category)
        if (data.length > 0 && data[0].category?.name) {
          setCategoryName(data[0].category.name);
        } else {
          // If no topics, maybe fetch category name separately? Or handle upstream.
          setCategoryName('Category'); // Fallback name
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [categoryId]);

  const handleCreateTopic = () => {
    // Navigate to a dedicated page or open a modal
    // Pass categoryId if the creation form needs it
    router.push(`/forum/topics/new?categoryId=${categoryId}`);
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString; // Fallback
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />

      <main className="flex-1 p-6 container mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => router.back()} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
                <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
             </button>
             <h1 className="text-2xl font-bold text-[var(--text-primary)]">
               {isLoading ? 'Loading...' : categoryName ? `${categoryName} Topics` : 'Topics'}
             </h1>
          </div>
          <button
            onClick={handleCreateTopic}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusCircle size={18} />
            <span>New Topic</span>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 flex justify-center items-center gap-2 text-[var(--text-muted)]">
            <Loader2 className="animate-spin" size={20} /> Loading topics...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">Error loading topics: {error}</div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
            <p className="text-[var(--text-muted)] text-lg mb-4">No topics found in this category yet.</p>
            <button
                onClick={handleCreateTopic}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors mx-auto"
            >
                <PlusCircle size={18} />
                <span>Be the first to create one!</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              // Map API data to ForumTopicCard props
              <ForumTopicCard
                key={topic.id}
                id={topic.id}
                title={topic.title}
                // Provide default/placeholder values for missing data
                content={""} // API doesn't provide topic content snippet yet
                author={{
                  id: topic.author.id ?? 'unknown', // Use author ID from API if available
                  name: topic.author.name, // Use author name from API
                  // avatar: topic.author.avatarUrl ?? undefined // Add avatar later if API provides it
                }}
                createdAt={topic.createdAt} // Pass raw timestamp, card formats it
                replyCount={0} // API doesn't provide reply count yet
                viewCount={0} // API doesn't provide view count yet
                // lastReply={undefined} // API doesn't provide last reply info yet
                // isPinned={topic.is_pinned ?? false} // Add later if API provides it
                // isLocked={topic.is_locked ?? false} // Add later if API provides it
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
