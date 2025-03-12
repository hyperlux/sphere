'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Eye, Clock, Pin, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForumTopicProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  replyCount: number;
  viewCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  lastReply?: {
    author: {
      id: string;
      name: string;
    };
    timestamp: string;
  };
  mood?: 'default' | 'question' | 'announcement' | 'discussion' | 'solved';
}

export default function ForumTopicCard({
  id,
  title,
  content,
  author,
  createdAt,
  replyCount,
  viewCount,
  isPinned = false,
  isLocked = false,
  lastReply,
  mood = 'default'
}: ForumTopicProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Dynamic color based on mood
  const getMoodColor = () => {
    switch (mood) {
      case 'question': return 'var(--dawn-gold)';
      case 'announcement': return 'var(--earth-orange)';
      case 'discussion': return '#3498db';
      case 'solved': return '#2ecc71';
      default: return 'var(--bg-tertiary)';
    }
  };
  
  const getMoodIcon = () => {
    switch (mood) {
      case 'question': return '❓';
      case 'announcement': return '📢';
      case 'discussion': return '💬';
      case 'solved': return '✅';
      default: return '';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      whileHover={{ 
        y: -3,
        boxShadow: `0 10px 25px -10px ${getMoodColor()}40`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)] transition-all duration-300"
      style={{
        boxShadow: isHovered ? `0 8px 25px -10px ${getMoodColor()}40` : `0 4px 15px -10px var(--bg-tertiary)`,
        borderLeft: `4px solid ${getMoodColor()}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/forums/topics/${id}`} className="block h-full">
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-start gap-4">
            <div className="avatar" style={{ backgroundColor: getMoodColor() }}>
              {author.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isPinned && <Pin size={14} className="text-orange-500" />}
                {isLocked && <Lock size={14} className="text-gray-500" />}
                {getMoodIcon() && <span className="text-sm">{getMoodIcon()}</span>}
                <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate">
                  {title}
                </h3>
              </div>
              
              <div className="flex items-center text-xs text-[var(--text-muted)] mb-2">
                <span className="font-medium text-[var(--text-secondary)]">{author.name}</span>
                <span className="mx-2">•</span>
                <Clock size={12} className="mr-1" />
                <span>{formatTimeAgo(createdAt)}</span>
              </div>
              
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                {content}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <div className="flex items-center">
                  <MessageSquare size={12} className="mr-1" />
                  <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                </div>
                <div className="flex items-center">
                  <Eye size={12} className="mr-1" />
                  <span>{viewCount} {viewCount === 1 ? 'view' : 'views'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {lastReply && (
            <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-xs">
              <p className="text-[var(--text-muted)]">
                Last reply by <span className="text-[var(--text-primary)]">{lastReply.author.name}</span> • {formatTimeAgo(lastReply.timestamp)}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
