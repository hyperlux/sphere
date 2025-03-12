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
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-[var(--bg-secondary)] h-full border-r border-[var(--border-color)] flex flex-col relative"
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-full p-1 shadow-md z-10 hover:bg-orange-500 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-semibold text-[var(--text-primary)]"
            >
              Forums
            </motion.h2>
          )}
        </AnimatePresence>
        
        <button
          onClick={onCreateTopic}
          className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors ${
            isCollapsed ? 'p-2 w-10 h-10 justify-center' : 'px-4 py-2'
          }`}
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
        </button>
      </div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 border-b border-[var(--border-color)]"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search forums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 overflow-y-auto">
        <div className={`py-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <div className="mb-4">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-2`}>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs uppercase text-[var(--text-muted)] font-medium tracking-wider"
                  >
                    Browse
                  </motion.h3>
                )}
              </AnimatePresence>
              
              {!isCollapsed && (
                <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <Filter size={14} />
                </button>
              )}
            </div>
            
            <ul className="space-y-1">
              <li>
                <Link
                  href="/forums"
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                  } rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forums' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
                  }`}
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
                  href="/forums/trending"
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                  } rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forums/trending' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
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
                  href="/forums/recent"
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                  } rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forums/recent' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
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
                  href="/forums/bookmarks"
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                  } rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                    pathname === '/forums/bookmarks' ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
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
          
          <div className="mb-4">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs uppercase text-[var(--text-muted)] font-medium tracking-wider mb-2"
                >
                  Categories
                </motion.h3>
              )}
            </AnimatePresence>
            
            <ul className="space-y-1">
              {filteredCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/forums/${category.id}`}
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                    } rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors ${
                      pathname === `/forums/${category.id}` ? 'bg-[var(--bg-tertiary)] text-orange-500' : 'text-[var(--text-primary)]'
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
                            <span className="text-sm truncate">{category.name}</span>
                            <span className="text-xs text-[var(--text-muted)]">{category.topicCount}</span>
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
                className="mb-4"
              >
                <h3 className="text-xs uppercase text-amber-600 font-medium tracking-wider mb-2 flex items-center gap-1">
                  <Flame size={14} />
                  Community Pulse
                </h3>
                <div className="space-y-2">
                  {trending.map((post) => (
                    <Link
                      key={post.id}
                      href={`/forums/topics/${post.topicId}`}
                      className="block p-2 rounded-lg bg-[rgba(255,183,77,0.1)] hover:bg-[rgba(255,183,77,0.2)] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{post.title}</span>
                        <span className="text-xs text-amber-600 font-medium">{getNetScore(post)} resonance</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">by {post.author}</div>
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
                <h3 className="text-xs uppercase text-[var(--text-muted)] font-medium tracking-wider mb-2">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/forums/tags/${tag}`}
                      className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded-md text-xs hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      <Tag size={12} />
                      {tag}
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
