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
  Filter,
  Search,
  Tag,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  trendingPosts?: Array<{
    id: string;
    title: string;
    topicId?: string;
    author?: string;
    upvotes?: number;
    downvotes?: number;
  }>;
}

export default function ForumSidebar({ 
  categories, 
  popularTags = [], 
  onCreateTopic,
  trendingPosts
}: ForumSidebarProps) {
  const { theme, toggleTheme } = useTheme();
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
    <aside
      className="w-64 md:w-64 sm:w-20 xs:w-0 bg-[var(--bg-secondary)] h-screen border-r border-[var(--border-color)] border-opacity-30 flex flex-col fixed left-0 top-0 bottom-0 z-10 sidebar-container overflow-x-hidden"
      style={{ 
        boxShadow: '8px 0 30px -15px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="p-4 border-b border-[var(--border-color)] border-opacity-30 flex items-center justify-between sidebar-header">
        <div>
          <Link href="/">
            <Image 
              src={theme === 'dark' ? '/logodark.png' : '/logolight.png'} 
              alt="Auroville.COMMUNITY" 
              width={200} 
              height={100} 
              className="mr-auto" 
            />
          </Link>
        </div>
        <button 
          onClick={toggleTheme}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className="py-3 border-b border-[var(--border-color)] border-opacity-30">
        <div className="flex items-center justify-center px-4">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
        </div>
      </div>
      
      <div className="border-b border-[var(--border-color)] border-opacity-30">
        <div className="px-4 py-3">
          <button
            onClick={onCreateTopic}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-md transition-colors px-4 py-2 w-full justify-center"
            style={{ boxShadow: '0 4px 12px -2px rgba(255, 149, 0, 0.3)' }}
            tabIndex={0}
          >
            <CirclePlus size={16} />
            <span className="text-sm font-medium whitespace-nowrap">
              New Topic
            </span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto sidebar-content">
        <div className="py-3 px-4">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase text-amber-500 font-semibold tracking-widest">
                Browse
              </h3>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 15 }} 
                className="text-[var(--text-muted)] hover:text-amber-500 transition-colors"
              >
                <Filter size={14} />
              </motion.button>
            </div>
            
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/forum"
                  className={`flex items-center px-3 py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] hover:bg-opacity-50 transition-all ${
                    pathname === '/forum' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md' 
                      : 'text-[var(--text-primary)]'
                  }`}
                  style={{
                    boxShadow: pathname === '/forums' 
                      ? '0 4px 12px -2px rgba(255, 149, 0, 0.3)' 
                      : undefined
                  }}
                >
                  <MessageSquare size={16} className="flex-shrink-0" />
                  <span className="ml-3 text-sm">All Categories</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/forum/trending"
                  className={`flex items-center px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forum/trending' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <TrendingUp size={16} className="flex-shrink-0" />
                  <span className="ml-3 text-sm">Trending</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/forum/recent"
                  className={`flex items-center px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forum/recent' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <Clock size={16} className="flex-shrink-0" />
                  <span className="ml-3 text-sm">Recent</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/forum/bookmarks"
                  className={`flex items-center px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forum/bookmarks' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <Bookmark size={16} className="flex-shrink-0" />
                  <span className="ml-3 text-sm">Bookmarks</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="mb-5">
            <h3 className="text-xs uppercase text-amber-500 font-semibold tracking-widest mb-3">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {filteredCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/forum/${category.id}`}
                    className={`flex items-center px-3 py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] hover:bg-opacity-50 transition-all ${
                      pathname === `/forums/${category.id}` 
                        ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-500 font-medium border border-amber-500/20' 
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="flex-shrink-0">{category.icon}</span>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm truncate font-medium">{category.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] bg-opacity-50 text-[var(--text-muted)]">{category.topicCount}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-5">
            <h3 className="text-xs uppercase text-amber-500 font-semibold tracking-widest mb-3 flex items-center gap-1">
              <Flame size={14} className="text-orange-500" />
              Community Pulse
            </h3>
            <div className="space-y-3">
              {trending.map((post) => (
                <Link
                  key={post.id}
                  href={`/forum/topics/${post.topicId}`}
                  className="block p-3 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/10 border border-amber-500/10 hover:border-amber-500/30 transition-all pulse-item relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pulse-glow"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 leading-tight pulse-title">{post.title}</span>
                      <div className="flex items-center text-xs text-[var(--text-muted)] mt-1.5">
                        <span>by </span>
                        <span className="text-amber-500 font-medium ml-1">{post.author}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium flex items-center gap-1">
                        <TrendingUp size={10} />
                        <span>{getNetScore(post)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {popularTags.length > 0 && (
            <div>
              <h3 className="text-xs uppercase text-amber-500 font-semibold tracking-widest mb-3">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/forum/tags/${tag}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-[var(--bg-tertiary)] to-[var(--bg-secondary)] text-[var(--text-muted)] rounded-full text-xs hover:from-amber-500 hover:to-orange-500 hover:text-white transition-all forum-tag"
                  >
                    <Tag size={10} />
                    <span className="forum-tag-text">{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}