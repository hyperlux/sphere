'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { 
  CirclePlus, 
  TrendingUp, 
  Clock, 
  Bookmark, 
  MessageSquare,
  Search,
  Tag,
  Flame
} from 'lucide-react';
import { mockAurovillePosts, getNetScore } from '@/data/mockData';

interface Category {
  id: string;
  name: string;
  icon: string;
  topicCount: number;
}

interface ForumSidebarProps {
  categories: Category[];
  popularTags?: string[];
  onCreateTopic?: () => void;
  trendingPosts?: {
    id: string;
    title: string;
    topicId?: string;
    author?: string;
    upvotes?: number;
    downvotes?: number;
  }[];
}

export default function ForumSidebar({ 
  categories, 
  popularTags = [], 
  onCreateTopic,
  trendingPosts
}: ForumSidebarProps) {
  const { theme } = useTheme();
  const [trending, setTrending] = useState<Array<{
    id: string;
    title: string;
    topicId: string;
    author: string;
    upvotes: number;
    downvotes: number;
  }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    if (trendingPosts) {
      setTrending(trendingPosts as any);
    } else {
      const sortedPosts = [...mockAurovillePosts]
        .sort((a, b) => getNetScore(b) - getNetScore(a))
        .slice(0, 3);
      setTrending(sortedPosts);
    }
  }, [trendingPosts]);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 bg-[var(--bg-secondary)] fixed h-full flex flex-col border-r border-[var(--border-color)] overflow-x-hidden transition-all duration-300 z-40">
      <div className="flex items-center py-2 pl-5 pb-6 border-b border-[var(--border-color)]">
        <Link href="/dashboard">
          <Image 
            src={theme === 'dark' ? '/logodark.png' : '/logolight.png'} 
            alt="Auroville.COMMUNITY" 
            width={200} 
            height={120} 
            className="mr-auto" 
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 pb-4">
        <div className="py-3 border-b border-[var(--border-color)]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm"
            />
          </div>
        </div>

        <div className="py-3 border-b border-[var(--border-color)]">
          <button
            onClick={onCreateTopic}
            className="flex items-center gap-2 bg-amber-500 text-white rounded-lg px-4 py-2 w-full justify-center hover:bg-amber-600 transition-colors"
          >
            <CirclePlus size={16} />
            <span className="text-sm font-medium">New Topic</span>
          </button>
        </div>

        <ul className="space-y-1 mt-4">
          <li>
            <Link
              href="/forum"
              className={`flex items-center text-sm py-2 px-2 rounded-lg transition-colors ${
                pathname === '/forum' 
                  ? 'bg-amber-500 text-white' 
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <MessageSquare size={20} className="mr-3" />
              All Categories
            </Link>
          </li>
          <li>
            <Link
              href="/forum/trending"
              className={`flex items-center text-sm py-2 px-2 rounded-lg transition-colors ${
                pathname === '/forum/trending' 
                  ? 'bg-amber-500 text-white' 
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <TrendingUp size={20} className="mr-3" />
              Trending
            </Link>
          </li>
          <li>
            <Link
              href="/forum/recent"
              className={`flex items-center text-sm py-2 px-2 rounded-lg transition-colors ${
                pathname === '/forum/recent' 
                  ? 'bg-amber-500 text-white' 
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <Clock size={20} className="mr-3" />
              Recent
            </Link>
          </li>
          <li>
            <Link
              href="/forum/bookmarks"
              className={`flex items-center text-sm py-2 px-2 rounded-lg transition-colors ${
                pathname === '/forum/bookmarks' 
                  ? 'bg-amber-500 text-white' 
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <Bookmark size={20} className="mr-3" />
              Bookmarks
            </Link>
          </li>
        </ul>

        <div className="mt-8">
          <h3 className="text-xs uppercase text-[var(--text-muted)] font-medium tracking-wider mb-3 px-2">
            Categories
          </h3>
          <ul className="space-y-1">
            {filteredCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/forum/${category.id}`}
                  className={`flex items-center text-sm py-2 px-2 rounded-lg transition-colors ${
                    pathname === `/forum/${category.id}` 
                      ? 'bg-amber-500 text-white' 
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <span className="mr-3">{category.icon}</span>
                  <span className="flex-1">{category.name}</span>
                  <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded-full">
                    {category.topicCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-xs uppercase text-[var(--text-muted)] font-medium tracking-wider mb-3 px-2 flex items-center gap-1">
            <Flame size={16} /> Community Pulse
          </h3>
          <ul className="space-y-2">
            {trending.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/forum/topics/${post.topicId}`}
                  className="block p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-amber-500/10 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-sm text-[var(--text-primary)] line-clamp-1">{post.title}</span>
                      <span className="text-xs text-[var(--text-muted)]">by {post.author}</span>
                    </div>
                    <span className="text-xs bg-amber-500/20 px-2 py-1 rounded-full">
                      {getNetScore(post)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {popularTags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs uppercase text-[var(--text-muted)] font-medium tracking-wider mb-3 px-2">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/forum/tags/${tag}`}
                  className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded-full text-xs hover:bg-amber-500 hover:text-white transition-colors"
                >
                  <Tag size={12} />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
