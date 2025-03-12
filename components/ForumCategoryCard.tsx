'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForumCategoryProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicCount: number;
  latestActivity?: {
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
  topicCount,
  latestActivity,
  isTrending = false
}: ForumCategoryProps) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 30px -15px var(--bg-tertiary)' }}
      className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)] transition-all duration-300"
      style={{
        boxShadow: '0 4px 20px -10px var(--bg-tertiary)',
      }}
    >
      <Link href={`/forums/${id}`} className="block h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3" aria-hidden="true">{icon}</span>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-orange-500 transition-colors">
                  {name}
                </h3>
                {isTrending && (
                  <div className="flex items-center text-orange-500">
                    <TrendingUp size={16} className="mr-1" />
                    <span className="text-xs font-medium">Trending</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                <MessageSquare size={14} className="inline mr-1" />
                {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
              </p>
            </div>
            <ChevronRight className="text-[var(--text-muted)] ml-2" />
          </div>
          
          <p className="text-[var(--text-secondary)] text-sm mb-4">{description}</p>
          
          {latestActivity && (
            <div className="mt-auto pt-4 border-t border-[var(--border-color)] text-xs">
              <p className="text-[var(--text-muted)]">Latest: <span className="text-orange-500">{latestActivity.topicTitle}</span></p>
              <p className="text-[var(--text-muted)]">
                by <span className="text-[var(--text-primary)]">{latestActivity.username}</span> • {latestActivity.timestamp}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
