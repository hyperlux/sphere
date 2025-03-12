'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronRight, 
  ChevronLeft, 
  PlusCircle, 
  TrendingUp, 
  Clock, 
  Bookmark, 
  MessageSquare,
  Filter,
  Search,
  Tag,
  Flame
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
  // If no trending posts are provided, use the mock data
  const [trending, setTrending] = useState<Array<{
    id: string;
    title: string;
    topicId: string;
    author: string;
    upvotes: number;
    downvotes: number;
  }>>([]);
  
  useEffect(() => {
    if (trendingPosts) {
      setTrending(trendingPosts as any);
    } else {
      // Sort posts by net score (upvotes - downvotes)
      const sortedPosts = [...mockAurovillePosts]
        .sort((a, b) => getNetScore(b) - getNetScore(a))
        .slice(0, 3);
      
      setTrending(sortedPosts);
    }
  }, [trendingPosts]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[var(--bg-secondary)] h-screen border-r border-[var(--border-color)] border-opacity-30 flex flex-col fixed left-0 top-0 bottom-0 z-10 sidebar-container"
      style={{ 
        boxShadow: '8px 0 30px -15px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        width: isCollapsed ? '80px' : '280px',
        transition: 'width 0.4s ease'
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="absolute -right-4 top-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full p-1.5 shadow-lg z-10 transition-colors toggle-sidebar-button"
        style={{ boxShadow: '0 0 15px rgba(255, 149, 0, 0.4)' }}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </motion.button>
      
      <div className="p-4 border-b border-[var(--border-color)] border-opacity-30 flex items-center justify-between sidebar-header">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-[var(--text-primary)] tracking-tight"
            >
              Auro<span className="text-amber-500">Forum</span>
            </motion.h2>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateTopic}
          className={`flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-md transition-colors ${
            isCollapsed ? 'p-2 w-10 h-10 justify-center' : 'px-4 py-2'
          }`}
          style={{ boxShadow: '0 4px 12px -2px rgba(255, 149, 0, 0.3)' }}
        >
          <PlusCircle size={isCollapsed ? 20 : 16} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                New Topic
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 border-b border-[var(--border-color)] border-opacity-30 search-container"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
              <input
                type="text"
                placeholder="Search forums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-primary)] bg-opacity-50 border border-[var(--border-color)] border-opacity-30 rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 overflow-y-auto sidebar-content">
        <div className={`py-3 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <div className="mb-5">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-3`}>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs uppercase text-amber-500 font-semibold tracking-widest"
                  >
                    Browse
                  </motion.h3>
                )}
              </AnimatePresence>
              
              {!isCollapsed && (
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 15 }} 
                  className="text-[var(--text-muted)] hover:text-amber-500 transition-colors"
                >
                  <Filter size={14} />
                </motion.button>
              )}
            </div>
            
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/forum"
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center p-2' : 'px-3 py-2.5'
                  } rounded-lg hover:bg-[var(--bg-tertiary)] hover:bg-opacity-50 transition-all ${
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
                  <MessageSquare size={isCollapsed ? 20 : 16} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-3 text-sm"
                      >
                        All Categories
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
              <li>
                <Link
                  href="/forum/trending"
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                  } rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forum/trending' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <TrendingUp size={isCollapsed ? 20 : 16} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-3 text-sm"
                      >
                        Trending
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
              <li>
                <Link
                  href="/forum/recent"
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                  } rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forum/recent' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <Clock size={isCollapsed ? 20 : 16} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-3 text-sm"
                      >
                        Recent
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
              <li>
                <Link
                  href="/forum/bookmarks"
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                  } rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forum/bookmarks' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <Bookmark size={isCollapsed ? 20 : 16} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-3 text-sm"
                      >
                        Bookmarks
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="mb-5">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs uppercase text-amber-500 font-semibold tracking-widest mb-3"
                >
                  Categories
                </motion.h3>
              )}
            </AnimatePresence>
            
            <ul className="space-y-1.5">
              {filteredCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/forum/${category.id}`}
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center p-2' : 'px-3 py-2.5'
                    } rounded-lg hover:bg-[var(--bg-tertiary)] hover:bg-opacity-50 transition-all ${
                      pathname === `/forums/${category.id}` 
                        ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-500 font-medium border border-amber-500/20' 
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="flex-shrink-0">{category.icon}</span>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="ml-3 flex-1 min-w-0"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm truncate font-medium">{category.name}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] bg-opacity-50 text-[var(--text-muted)]">{category.topicCount}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-5"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {!isCollapsed && popularTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
