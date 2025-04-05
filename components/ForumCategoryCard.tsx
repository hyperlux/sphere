'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ForumCategoryProps {
  id: string;
  name: string;
  description: string; // Keep as required, handle null upstream if needed
  icon: string; // Keep as required, handle null upstream if needed
  topicCount?: number; // Make optional
  latestActivity?: { // Keep optional
    topicTitle: string;
    username: string;
    timestamp: string;
  };
  isTrending?: boolean;
}

export default function ForumCategoryCard({
  id,
  name,
  description,
  icon,
  topicCount, // Now optional
  latestActivity, // Already optional
  isTrending = false // Already optional
}: ForumCategoryProps) {
  const [iconSize, setIconSize] = useState("text-3xl");
  const [headingSize, setHeadingSize] = useState("text-xl");
  const [padding, setPadding] = useState("p-6");
  
  // Responsive adjustments based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setIconSize("text-2xl");
        setHeadingSize("text-lg");
        setPadding("p-4");
      } else if (width < 768) {
        setIconSize("text-2xl");
        setHeadingSize("text-lg");
        setPadding("p-5");
      } else {
        setIconSize("text-3xl");
        setHeadingSize("text-xl");
        setPadding("p-6");
      }
    };
    
    // Run on mount and window resize
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 25px -15px var(--bg-tertiary)' }}
      className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)] transition-all duration-300 h-full forum-category-card"
      style={{
        boxShadow: '0 4px 20px -10px var(--bg-tertiary)',
      }}
    >
      <Link href={`/forum/${id}`} className="block h-full">
        <div className={`${padding} flex flex-col h-full`}>
          <div className="flex items-start mb-3 md:mb-4">
            <span className={`${iconSize} mr-2 md:mr-3 mt-1 flex-shrink-0`} aria-hidden="true">{icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start flex-wrap">
                <h3 className={`${headingSize} font-semibold text-[var(--text-primary)] transition-colors pr-2 truncate max-w-full`}>
                  {name}
                </h3>
                {isTrending && (
                  <div className="flex items-center text-orange-500 ml-auto">
                    <TrendingUp size={14} className="mr-1" />
                    <span className="text-xs font-medium">Trending</span>
                  </div>
                )}
              </div>
              {/* Conditionally render topic count */}
              {topicCount !== undefined && (
                <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1 truncate">
                  <MessageSquare size={12} className="inline mr-1" />
                  {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
                </p>
              )}
            </div>
            {/* Always show chevron for link indication */}
            <ChevronRight className="text-[var(--text-muted)] ml-1 md:ml-2 mt-2 flex-shrink-0" size={18} />
          </div>
          
          <p className="text-[var(--text-secondary)] text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">{description}</p>
          
          {latestActivity && (
            <div className="mt-auto pt-3 md:pt-4 border-t border-[var(--border-color)] text-xs">
              <p className="text-[var(--text-muted)] truncate">
                Latest: <span className="text-orange-500 line-clamp-1 inline-block align-bottom max-w-[calc(100%-56px)]">{latestActivity.topicTitle}</span>
              </p>
              <div className="flex justify-between items-center mt-1 flex-wrap gap-1">
                <p className="text-[var(--text-muted)] truncate max-w-[50%]">
                  by <span className="text-[var(--text-primary)]">{latestActivity.username}</span>
                </p>
                <p className="text-[var(--text-muted)] text-right">{latestActivity.timestamp}</p>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
