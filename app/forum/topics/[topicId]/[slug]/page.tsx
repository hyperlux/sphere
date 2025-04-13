'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
// Removed Header import
import ForumPostCard from '@/components/ForumPostCard';
import CreatePostForm from '@/components/CreatePostForm';
import { useAuth } from '@/components/AuthProvider';

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    joinDate: string;
    postCount: number;
  };
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  downvotes: number;
  reactions: {
    type: string;
    count: number;
    reacted: boolean;
  }[];
  isSolution?: boolean;
  parentId?: string | null;
}

interface Topic {
  id: string;
  title: string;
  slug: string;
  content?: string;
  category_id?: string;
  author_id?: string;
  created_at?: string;
  last_activity_at?: string;
}

export default function TopicPage() {
  const params = useParams();
  // Support both /topics/[topicId] and /topics/[topicId]/[slug]
  const topicId = Array.isArray(params.topicId) ? params.topicId[0] : params.topicId;
  const slug = params.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : undefined;
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topicLoading, setTopicLoading] = useState(true);
  const [topicError, setTopicError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTopic = async () => {
      setTopicLoading(true);
      setTopicError(null);
      try {
        const response = await fetch(`/api/forum/topics/${topicId}`);
        if (!response.ok) throw new Error(`Failed to fetch topic: ${response.statusText}`);
        const data = await response.json();
        setTopic(data);

        // If slug is missing or incorrect, redirect to the canonical URL
        if (data && data.slug && slug !== data.slug) {
          router.replace(`/forum/topics/${topicId}/${data.slug}`);
        }
      } catch (err) {
        setTopicError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setTopicLoading(false);
      }
    };

    if (topicId) {
      fetchTopic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  // Move fetchPosts outside useEffect so it can be called elsewhere
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/forum/topics/${topicId}/posts`);
      if (!response.ok) throw new Error(`Failed to fetch posts: ${response.statusText}`);
      const data = await response.json();

      const transformedPosts = (data.posts || []).map((p: any) => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        parentId: p.parentPostId ?? null,
        upvotes: 0,
        downvotes: 0,
        reactions: [],
        isSolution: false,
        author: {
          id: p.author?.id ?? '',
          name: p.author?.username ?? 'Unknown User',
          avatar: p.author?.avatarUrl ?? null,
          role: '',
          joinDate: '',
          postCount: 0,
        },
      }));

      setPosts(transformedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      fetchPosts();
    }
  }, [topicId]);

  const handleCreatePost = async (content: string, parentId?: string | null) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/forum/topics/${topicId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId })
      });
      if (!response.ok) throw new Error(`Failed to create post: ${response.statusText}`);
      const newPost = await response.json();
      // After successful post, re-fetch posts to update UI
      await fetchPosts();
      setShowReplyForm(false);
    } catch (err) {
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPosts = (parentId: string | null = null, depth = 0) => {
    return posts
      .filter(p => p.parentId === parentId)
      .map(p => (
        <div key={p.id}>
          <ForumPostCard
            {...p}
            depth={depth}
            onReply={() => setShowReplyForm(true)}
          />
          {renderPosts(p.id, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex pt-3 md:ml-64 sm:ml-20 transition-all duration-300">
      <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
      <div className="flex-1 flex flex-col">
        <main className="p-6 w-full transition-all duration-300">
          {/* Forum Topic Header */}
          <div className="mb-8">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-8 shadow-md flex flex-col gap-2">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                  {topic?.title?.charAt(0).toUpperCase() || "T"}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                    {topicLoading
                      ? 'Loading topic...'
                      : topicError
                      ? 'Error loading topic'
                      : topic?.title || 'Discussion'}
                  </h1>
                  {topic?.created_at && (
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      {new Date(topic.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
                {user && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="ml-auto px-4 py-2 rounded bg-[var(--auroville-teal)] text-white hover:bg-opacity-80 transition"
                  >
                    {showReplyForm ? 'Cancel' : 'Reply'}
                  </button>
                )}
              </div>
              {topic && topic.content && (
                <div className="prose prose-lg max-w-none text-[var(--text-secondary)] mt-2">
                  {topic.content.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {showReplyForm && (
            <div className="mb-6">
              <CreatePostForm
                topicId={topicId as string}
                onSubmit={async ({ content, topicId: _tid, parentId }) => {
                  await handleCreatePost(content, parentId ?? null);
                }}
                onCancel={() => setShowReplyForm(false)}
                isLoading={isSubmitting}
              />
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12 text-[var(--text-muted)]">Loading posts...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Error loading posts: {error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">No posts found.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {renderPosts()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
