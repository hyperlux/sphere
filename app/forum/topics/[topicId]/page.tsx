'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
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
  const { topicId } = useParams();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [collapsedPosts, setCollapsedPosts] = useState<{ [postId: string]: boolean }>({});

  const handleToggleCollapse = (postId: string) => {
    setCollapsedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topicLoading, setTopicLoading] = useState(true);
  const [topicError, setTopicError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      setTopicLoading(true);
      setTopicError(null);
      try {
        const response = await fetch(`/api/forum/topics/${topicId}`);
        if (!response.ok) throw new Error(`Failed to fetch topic: ${response.statusText}`);
        const data = await response.json();
        setTopic(data);
      } catch (err) {
        setTopicError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setTopicLoading(false);
      }
    };

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('topicId:', topicId);
        const response = await fetch(`/api/forum/topics/${topicId}/posts`);
        if (!response.ok) throw new Error(`Failed to fetch posts: ${response.statusText}`);
        const data = await response.json();
        console.log('API response for posts:', data);
        console.log('Posts array:', data.posts);

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
      } catch (err: any) {
        setError(err.message || 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

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
        body: JSON.stringify({ content, parentPostId: parentId })
      });
      if (!response.ok) throw new Error(`Failed to create post: ${response.statusText}`);
      const newPost = await response.json();
      setPosts(prev => [...prev, newPost]);
      setShowReplyForm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPosts = (parentId: string | null = null, depth = 0) => {
    return posts
      .filter(p => p.parentId === parentId)
      .map(p => {
        const hasChildren = posts.some(child => child.parentId === p.id);
        const isCollapsed = collapsedPosts[p.id] ?? false;
        return (
          <div key={p.id}>
            <ForumPostCard
              {...p}
              depth={depth}
              hasChildren={hasChildren}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => handleToggleCollapse(p.id)}
              onReply={() => setShowReplyForm(true)}
            />
            {!isCollapsed && renderPosts(p.id, depth + 1)}
          </div>
        );
      });
  };

  return (
    <>
      <div style={{ background: "red", color: "white", fontSize: "2rem", padding: "1rem", textAlign: "center", zIndex: 9999 }}>
        DEBUG: [topicId]/page.tsx is rendering
      </div>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
    
        <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
          <div className="fixed top-0 md:left-64 sm:left-20 right-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
            <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} visitorCount={1247} />
          </div>
    
          <main className="p-6 w-full pt-24 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                {topicLoading
                  ? 'Loading topic...'
                  : topicError
                  ? 'Error loading topic'
                  : topic?.title || 'Discussion'}
              </h1>
              {/* DEBUG: Show raw topic and content value, always visible */}
              <div className="text-xs text-yellow-400 mb-2">
                <strong>DEBUG topic:</strong> {JSON.stringify(topic)}
              </div>
              {user && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="px-4 py-2 rounded bg-[var(--auroville-teal)] text-white hover:bg-opacity-80 transition"
                >
                  {showReplyForm ? 'Cancel' : 'Reply'}
                </button>
              )}
            </div>
    
            {/* Show topic content as the initial post */}
            {topic && topic.content && (
              <div className="mb-8">
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                      {topic.title?.charAt(0).toUpperCase() || "T"}
                    </div>
                    <span className="font-medium text-[var(--text-primary)]">Original Post</span>
                    {topic.created_at && (
                      <span className="ml-2 text-xs text-[var(--text-muted)]">
                        {new Date(topic.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <div className="prose prose-lg max-w-none text-[var(--text-secondary)]">
                    <p>{topic.content}</p>
                  </div>
                </div>
              </div>
            )}
    
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
    </>
  );
}
