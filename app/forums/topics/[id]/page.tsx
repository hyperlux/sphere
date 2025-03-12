'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Bookmark, Flag, MessageSquare, Eye, Clock, Pin, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ForumSidebar from '@/components/ForumSidebar';
import ForumPostCard from '@/components/ForumPostCard';
import CreatePostForm from '@/components/CreatePostForm';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { mockAurovillePosts, getNetScore, isTrendingPost } from '@/data/mockData';

// Mock data for demonstration
const mockCategories = [
  {
    id: '1',
    name: 'Announcements',
    description: 'Official announcements from Auroville',
    icon: '📢',
    topicCount: 12
  },
  {
    id: '2',
    name: 'Community Projects',
    description: 'Discussions about ongoing and future community projects',
    icon: '🌱',
    topicCount: 28
  },
  {
    id: '3',
    name: 'Sustainability',
    description: 'Discussions about sustainable living and practices',
    icon: '♻️',
    topicCount: 45
  },
  {
    id: '4',
    name: 'Volunteer Opportunities',
    description: 'Find and offer volunteer opportunities in Auroville',
    icon: '🤝',
    topicCount: 19
  },
  {
    id: '5',
    name: 'Cultural Exchange',
    description: 'Share and discuss cultural experiences and events',
    icon: '🎭',
    topicCount: 32
  },
  {
    id: '6',
    name: 'Spiritual Growth',
    description: 'Discussions about spiritual practices and growth',
    icon: '🧘',
    topicCount: 56
  },
  {
    id: '7',
    name: 'General Discussion',
    description: 'General topics related to Auroville',
    icon: '💬',
    topicCount: 87
  }
];

// Define types for the Auroville post and reply
interface AurovillePost {
  id: string;
  topicId: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  replies?: AurovilleReply[];
}

interface AurovilleReply {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

// Convert mockAurovillePosts to the format expected by the page
const createMockTopic = (post: AurovillePost) => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    categoryId: post.topicId.startsWith('t') ? post.topicId.substring(1) : post.topicId,
    author: {
      id: `user-${post.id}`,
      name: post.author,
      avatar: '',
      role: 'Community Member',
      joinDate: 'Jan 2025',
      postCount: Math.floor(Math.random() * 100) + 1
    },
    createdAt: post.timestamp,
    updatedAt: post.timestamp,
    replyCount: post.replies?.length || 0,
    viewCount: Math.floor(Math.random() * 100) + 20,
    isPinned: isTrendingPost(post),
    isLocked: false,
    mood: 'discussion',
    tags: ['auroville', 'community', post.title.toLowerCase().split(' ')[0]]
  };
};

// Convert mockAurovillePosts to the format expected by ForumPostCard
const createMockPosts = (post: AurovillePost) => {
  const mainPost = {
    id: `post-${post.id}`,
    content: post.content,
    author: {
      id: `user-${post.id}`,
      name: post.author,
      avatar: '',
      role: 'Community Member',
      joinDate: 'Jan 2025',
      postCount: Math.floor(Math.random() * 100) + 1
    },
    createdAt: post.timestamp,
    updatedAt: post.timestamp,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    reactions: [
      { type: 'like', count: Math.floor(post.upvotes / 3), reacted: false },
      { type: '👍', count: Math.floor(post.upvotes / 4), reacted: false }
    ],
    isSolution: false,
    isParent: true,
    depth: 0
  };
  
  const replyPosts = post.replies?.map((reply: AurovilleReply, index: number) => ({
    id: reply.id,
    content: reply.content,
    author: {
      id: `user-reply-${index}`,
      name: reply.author,
      avatar: '',
      role: 'Community Member',
      joinDate: 'Feb 2025',
      postCount: Math.floor(Math.random() * 50) + 1
    },
    createdAt: reply.timestamp,
    updatedAt: reply.timestamp,
    upvotes: reply.upvotes,
    downvotes: reply.downvotes,
    reactions: [
      { type: 'like', count: Math.floor(reply.upvotes / 2), reacted: false }
    ],
    isSolution: index === 0, // Make the first reply the solution for demo
    isParent: false,
    depth: 1,
    parentId: `post-${post.id}`
  })) || [];
  
  return [mainPost, ...replyPosts];
};

const popularTags = [
  'sustainability', 'community', 'events', 'meditation', 'yoga', 
  'volunteering', 'education', 'art', 'technology', 'farming'
];

export default function TopicPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const topicId = params.id as string;
  
  const [topic, setTopic] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const replyFormRef = useRef<HTMLDivElement>(null);
  
  // Fetch topic, category, and posts
  useEffect(() => {
    // Find the post that matches the topicId
    const matchingPost = mockAurovillePosts.find(post => post.topicId === topicId || post.id === topicId);
    
    if (matchingPost) {
      const mockTopic = createMockTopic(matchingPost);
      const mockPosts = createMockPosts(matchingPost);
      
      setTopic(mockTopic);
      setCategory(mockCategories.find(cat => cat.id === mockTopic.categoryId));
      setPosts(mockPosts);
    } else {
      // Fallback to first post if no match
      const firstPost = mockAurovillePosts[0];
      const mockTopic = createMockTopic(firstPost);
      const mockPosts = createMockPosts(firstPost);
      
      setTopic(mockTopic);
      setCategory(mockCategories.find(cat => cat.id === mockTopic.categoryId) || mockCategories[0]);
      setPosts(mockPosts);
    }
  }, [topicId]);
  
  const handleReply = (postId: string) => {
    setReplyingTo(postId);
    
    // Scroll to reply form
    setTimeout(() => {
      replyFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleReaction = (postId: string, reactionType: string) => {
    // In a real app, you would call an API
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const existingReaction = post.reactions.find((r: { type: string; count: number; reacted: boolean }) => r.type === reactionType);
        if (existingReaction) {
          // Toggle reaction
          return {
            ...post,
            reactions: post.reactions.map((r: { type: string; count: number; reacted: boolean }) => 
              r.type === reactionType 
                ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                : r
            )
          };
        } else {
          // Add new reaction
          return {
            ...post,
            reactions: [...post.reactions, { type: reactionType, count: 1, reacted: true }]
          };
        }
      }
      return post;
    }));
  };
  
  const handleMarkSolution = (postId: string) => {
    // In a real app, you would call an API
    setPosts(posts.map(post => ({
      ...post,
      isSolution: post.id === postId
    })));
  };
  
  const handleSubmitPost = async (data: { content: string; topicId: string; parentId?: string }) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, you would call an API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        id: `post${posts.length + 1}`,
        content: data.content,
        author: {
          id: user?.id || 'anonymous',
          name: user?.user_metadata?.name || 'Anonymous',
          avatar: '',
          role: 'Community Member',
          joinDate: 'Mar 2025',
          postCount: 1
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reactions: [{ type: 'like', count: 0, reacted: false }],
        isSolution: false,
        isParent: false,
        depth: data.parentId ? (posts.find(p => p.id === data.parentId)?.depth || 0) + 1 : 0,
        parentId: data.parentId
      };
      
      setPosts([...posts, newPost]);
      setReplyingTo(null);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting post:', error);
      setIsSubmitting(false);
    }
  };
  
  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would call an API
  };

  if (!topic || !category) {
    return (
      <div className="flex min-h-screen bg-[var(--bg-primary)] justify-center items-center">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <ForumSidebar 
        categories={mockCategories}
        popularTags={popularTags}
        onCreateTopic={() => router.push(`/forums/${category.id}/new`)}
      />
      
      <div className="flex-1 ml-[280px]">
        <Header user={user ? { email: user.email || '', name: user.user_metadata?.name } : null} />
        
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/forums/${category.id}`} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowLeft size={20} />
              </Link>
              
              <div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span className="text-xl">{category.icon}</span>
                  <Link href={`/forums/${category.id}`} className="hover:text-[var(--text-primary)] transition-colors">
                    {category.name}
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  {topic.title}
                </h1>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleBookmark}
                    className={`p-2 rounded-lg transition-colors ${
                      isBookmarked 
                        ? 'text-orange-500 bg-orange-500/10' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
                  >
                    <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
                  </button>
                  
                  <button
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                    aria-label="Share topic"
                  >
                    <Share2 size={18} />
                  </button>
                  
                  <button
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                    aria-label="Report topic"
                  >
                    <Flag size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{posts.length} {posts.length === 1 ? 'reply' : 'replies'}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{topic.viewCount} {topic.viewCount === 1 ? 'view' : 'views'}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                </div>
                
                {topic.isPinned && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Pin size={14} />
                    <span>Pinned</span>
                  </div>
                )}
                
                {topic.isLocked && (
                  <div className="flex items-center gap-1">
                    <Lock size={14} />
                    <span>Locked</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {topic.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/forums/tags/${tag}`}
                    className="px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded-md text-xs hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {posts.map((post) => (
              <ForumPostCard
                key={post.id}
                id={post.id}
                content={post.content}
                author={post.author}
                createdAt={post.createdAt}
                updatedAt={post.updatedAt}
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                reactions={post.reactions}
                isSolution={post.isSolution}
                isParent={post.isParent}
                depth={post.depth}
                onReply={handleReply}
                onReaction={handleReaction}
                onMarkSolution={handleMarkSolution}
                onUpvote={(id) => {
                  setPosts(posts.map(p => 
                    p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
                  ));
                }}
                onDownvote={(id) => {
                  setPosts(posts.map(p => 
                    p.id === id ? { ...p, downvotes: p.downvotes + 1 } : p
                  ));
                }}
              />
            ))}
          </div>
          
          {!topic.isLocked && (
            <div ref={replyFormRef} className="mt-8">
              <CreatePostForm
                topicId={topicId}
                parentId={replyingTo || undefined}
                onSubmit={handleSubmitPost}
                onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
                isLoading={isSubmitting}
                isReply={!!replyingTo}
                replyingTo={replyingTo ? posts.find(p => p.id === replyingTo)?.author.name : undefined}
              />
            </div>
          )}
          
          {topic.isLocked && (
            <div className="mt-8 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-center text-[var(--text-muted)]">
              <Lock size={18} className="mx-auto mb-2" />
              <p>This topic is locked. New replies are not allowed.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
