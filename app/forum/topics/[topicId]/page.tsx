'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Send, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import ForumPostCard from '@/components/ForumPostCard'; // Assuming this component exists or will be created
import { formatDistanceToNow } from 'date-fns';

// Define structure for a single post from API
interface ForumPost {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  parentPostId: string | null;
  author: {
    id: string | null;
    username: string;
    avatarUrl: string | null;
  };
  // Add vote counts later
}

// Define structure for pagination info from API
interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPosts: number;
  totalPages: number;
}

// Define structure for the topic details (could be fetched separately or inferred)
interface TopicDetails {
    id: string;
    title: string;
    // Add category name/id, author etc. if needed
}

export default function TopicPostsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const topicId = params.topicId as string;

  const [topicDetails, setTopicDetails] = useState<TopicDetails | null>(null); // State for topic info
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isPostingReply, setIsPostingReply] = useState(false);

  // Fetch initial posts (page 1)
  const fetchPosts = useCallback(async (page = 1) => {
    if (!topicId) return;
    setError(null);
    if (page === 1) setIsLoading(true); else setIsLoadingMore(true);

    try {
      const response = await fetch(`/api/forum/topics/${topicId}/posts?page=${page}&limit=20`); // Fetch page
      if (!response.ok) {
        if (response.status === 404) throw new Error(`Topic not found.`);
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();

      // TODO: Fetch topic details separately if needed, or extract from posts if possible
      // For now, setting a placeholder title
      if (!topicDetails) setTopicDetails({ id: topicId, title: "Topic" });

      setPosts(prevPosts => page === 1 ? data.posts : [...prevPosts, ...data.posts]); // Replace or append posts
      setPagination(data.pagination);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setPosts([]); // Clear posts on error
      setPagination(null);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [topicId, topicDetails]); // Add topicDetails dependency

  useEffect(() => {
    fetchPosts(1); // Fetch first page on mount
  }, [fetchPosts]); // Depend on the memoized fetchPosts

  const handleLoadMore = () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      fetchPosts(pagination.currentPage + 1);
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!replyContent.trim() || isPostingReply) return;

     setIsPostingReply(true);
     setError(null);

     try {
        const response = await fetch(`/api/forum/topics/${topicId}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: replyContent }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to post reply: ${response.statusText}`);
        }

        const newPost: ForumPost = await response.json();
        // Add the new post to the beginning or end of the list? End for chronological.
        setPosts(prevPosts => [...prevPosts, newPost]);
        setReplyContent(''); // Clear input
        // Optionally update pagination totalPosts? Might require re-fetch or careful state update.

     } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to post reply');
     } finally {
        setIsPostingReply(false);
     }
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString; // Fallback
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />

      <main className="flex-1 p-6 container mx-auto max-w-3xl">
        <div className="mb-6">
           <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-3">
              <ArrowLeft size={16} />
              Back to Topics
           </button>
           <h1 className="text-3xl font-bold text-[var(--text-primary)] break-words">
             {isLoading ? 'Loading Topic...' : topicDetails?.title ?? 'Topic'}
           </h1>
           {/* TODO: Add topic author, category link etc. here */}
        </div>

        {isLoading && posts.length === 0 ? ( // Show initial loading state
          <div className="text-center py-12 flex justify-center items-center gap-2 text-[var(--text-muted)]">
            <Loader2 className="animate-spin" size={20} /> Loading posts...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">Error loading posts: {error}</div>
        ) : posts.length === 0 && !isLoading ? ( // Handle case where topic exists but has no posts
           <div className="text-center py-12 text-[var(--text-muted)]">No posts in this topic yet.</div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              // Map API data to ForumPostCard props
              <ForumPostCard
                key={post.id}
                id={post.id} // Use 'id' instead of 'postId'
                content={post.content}
                author={{ // Pass author as an object
                  id: post.author.id ?? 'unknown',
                  name: post.author.username, // Map username to name
                  avatar: post.author.avatarUrl ?? undefined, // Map avatarUrl to avatar
                  // Provide placeholders for missing details
                  role: undefined,
                  joinDate: '', // Placeholder
                  postCount: 0, // Placeholder
                }}
                createdAt={post.createdAt} // Pass raw timestamp, card formats it
                updatedAt={post.updatedAt ?? undefined} // Pass raw timestamp if available
                // Provide defaults for other required/optional props if needed by ForumPostCard
                upvotes={0} // Assuming default or will be fetched later
                downvotes={0} // Assuming default or will be fetched later
                // Removed replyCount and viewCount as they are not expected props based on the error
              />
            ))}

            {/* Load More Button */}
            {pagination && pagination.currentPage < pagination.totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {isLoadingMore ? <Loader2 className="animate-spin" size={18} /> : <MessageSquare size={18} />}
                  {isLoadingMore ? 'Loading...' : 'Load More Posts'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reply Form */}
        {user && !isLoading && !error && ( // Only show reply form if logged in and topic loaded
            <form onSubmit={handlePostReply} className="mt-8 pt-6 border-t border-[var(--border-color)]">
                <h2 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">Post a Reply</h2>
                <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    rows={4}
                    className="w-full p-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                />
                <div className="mt-3 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPostingReply || !replyContent.trim()}
                        className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPostingReply ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        {isPostingReply ? 'Posting...' : 'Post Reply'}
                    </button>
                </div>
            </form>
        )}
      </main>
    </div>
  );
}
