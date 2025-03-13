'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Eye, Clock, Pin, Lock, Heart, TrendingUp, Tag } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Track screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    
    // Set initial value
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Dynamic color based on mood
  const getMoodColor = () => {
    switch (mood) {
      case 'question': return 'var(--auroville-ochre)';
      case 'announcement': return 'var(--auroville-amber)';
      case 'discussion': return 'var(--auroville-teal)';
      case 'solved': return 'var(--auroville-mint)';
      default: return 'var(--bg-tertiary)';
    }
  };
  
  const getMoodGradient = () => {
    switch (mood) {
      case 'question': return 'linear-gradient(135deg, var(--auroville-ochre), #F8D76E)';
      case 'announcement': return 'linear-gradient(135deg, var(--auroville-amber), var(--auroville-coral))';
      case 'discussion': return 'linear-gradient(135deg, var(--auroville-teal), #85DFFF)';
      case 'solved': return 'linear-gradient(135deg, var(--auroville-mint), #98EECC)';
      default: return 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))';
    }
  };
  
  const getMoodIcon = () => {
    switch (mood) {
      case 'question': return { icon: '❓', label: 'Question' };
      case 'announcement': return { icon: '📢', label: 'Announcement' };
      case 'discussion': return { icon: '💬', label: 'Discussion' };
      case 'solved': return { icon: '✅', label: 'Solved' };
      default: return { icon: '', label: '' };
    }
  };
  
  const topicPopularity = () => {
    if (viewCount > 200 || replyCount > 30) return 'trending';
    if (viewCount > 100 || replyCount > 15) return 'popular';
    return 'normal';
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
        y: -4,
        boxShadow: `0 14px 28px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 20px 1px ${getMoodColor()}40`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`forum-topic-card rounded-xl overflow-hidden border border-opacity-40 transition-all duration-300 ${
        topicPopularity() === 'trending' ? 'trending-topic' : 
        topicPopularity() === 'popular' ? 'popular-topic' : ''
      }`}
      style={{
        boxShadow: isHovered ? `0 8px 25px -10px ${getMoodColor()}40` : `0 4px 15px -10px var(--bg-tertiary)`,
        borderLeft: `4px solid ${getMoodColor()}`,
        background: `var(--bg-secondary)`,
        borderColor: `${getMoodColor()}30`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/forums/topics/${id}`} className="block h-full">
        <div className={`${isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'} flex flex-col h-full`}>
          <div className={`flex items-start ${isMobile ? 'gap-3' : 'gap-4'}`}>
            <div className={`avatar-wrapper ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0`} 
                 style={{ background: getMoodGradient() }}>
              {author.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`flex flex-col ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                <div className="flex gap-1.5 items-center flex-wrap mb-1">
                  {topicPopularity() === 'trending' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500 bg-opacity-20 text-amber-500 text-xs rounded-full">
                      <TrendingUp size={10} className="animate-pulse" />
                      <span>{isMobile ? '' : 'Trending'}</span>
                    </span>
                  )}
                  
                  {isPinned && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-500 bg-opacity-20 text-orange-500 text-xs rounded-full">
                      <Pin size={10} />
                      <span>{isMobile ? '' : 'Pinned'}</span>
                    </span>
                  )}
                  
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-500 bg-opacity-20 text-gray-400 text-xs rounded-full">
                      <Lock size={10} />
                      <span>{isMobile ? '' : 'Locked'}</span>
                    </span>
                  )}
                  
                  {getMoodIcon().icon && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-opacity-20 text-xs rounded-full"
                          style={{ 
                            backgroundColor: `${getMoodColor()}30`,
                            color: getMoodColor()
                          }}>
                      <span>{getMoodIcon().icon}</span>
                      <span>{isMobile ? '' : getMoodIcon().label}</span>
                    </span>
                  )}
                </div>
                
                <h3 className={`${isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-xl'} font-semibold text-[var(--text-primary)] line-clamp-2 topic-title`}>
                  {title}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center text-xs text-[var(--text-muted)] mb-2">
                <span className="font-medium text-[var(--text-secondary)] truncate max-w-[120px]">{author.name}</span>
                <span className="mx-1.5">•</span>
                <Clock size={12} className="mr-1" />
                <span>{formatTimeAgo(createdAt)}</span>
              </div>
              
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-[var(--text-secondary)] line-clamp-2 ${isMobile ? 'mb-2.5' : 'mb-4'} topic-excerpt`}>
                {content}
              </p>
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className={`flex flex-wrap items-center ${isMobile ? 'gap-1.5' : 'gap-2'} text-xs text-[var(--text-muted)]`}>
                  <div className={`flex items-center gap-1 ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'} rounded-full bg-[var(--bg-tertiary)] bg-opacity-50`}>
                    <MessageSquare size={10} />
                    <span>{replyCount}{isMobile ? '' : replyCount === 1 ? ' reply' : ' replies'}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'} rounded-full bg-[var(--bg-tertiary)] bg-opacity-50`}>
                    <Eye size={10} />
                    <span>{viewCount}{isMobile ? '' : viewCount === 1 ? ' view' : ' views'}</span>
                  </div>
                  {!isMobile && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--bg-tertiary)] bg-opacity-50`}>
                      <Heart size={10} />
                      <span>{Math.floor(viewCount / 10)} likes</span>
                    </div>
                  )}
                </div>
                
                <motion.div 
                  className="topic-action-indicator hidden sm:block"
                  animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs font-medium" style={{ color: getMoodColor() }}>View Discussion →</span>
                </motion.div>
              </div>
            </div>
          </div>
          
          {lastReply && !isMobile && (
            <div className={`mt-3 pt-2.5 border-t border-[var(--border-color)] border-opacity-20 text-xs`}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                     style={{ background: getMoodGradient() }}>
                  {lastReply.author.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-[var(--text-muted)] truncate">
                  Last reply by <span className="text-[var(--text-primary)] font-medium">{lastReply.author.name}</span> • {formatTimeAgo(lastReply.timestamp)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
