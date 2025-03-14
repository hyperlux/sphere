'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Share2, MoreHorizontal, Check, Award, ChevronUp, ChevronDown, Heart, BookmarkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostEngagementColor, isTrendingPost } from '@/data/mockData';

interface ForumPostProps {
  id: string;
  title?: string;
  content: string;
  author: string | {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    joinDate: string;
    postCount: number;
  };
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
  upvotes?: number;
  downvotes?: number;
  reactions?: {
    type: string;
    count: number;
    reacted: boolean;
  }[];
  isSolution?: boolean;
  isParent?: boolean;
  depth?: number;
  onReply?: (postId: string) => void;
  onReaction?: (postId: string, reactionType: string) => void;
  onMarkSolution?: (postId: string) => void;
  onUpvote?: (postId: string) => void;
  onDownvote?: (postId: string) => void;
}

export default function ForumPostCard({
  id,
  title,
  content,
  author,
  timestamp,
  createdAt,
  updatedAt,
  upvotes = 0,
  downvotes = 0,
  reactions = [],
  isSolution = false,
  isParent = false,
  depth = 0,
  onReply,
  onReaction,
  onMarkSolution,
  onUpvote,
  onDownvote
}: ForumPostProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [votes, setVotes] = useState({ upvotes, downvotes });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReplyPreview, setShowReplyPreview] = useState(false);
  
  // Update votes when props change
  useEffect(() => {
    setVotes({ upvotes, downvotes });
  }, [upvotes, downvotes]);
  
  const netScore = votes.upvotes - votes.downvotes;
  const isTrending = netScore > 30;
  
  // Determine post mood based on engagement
  const getMoodClass = () => {
    if (isTrending) return 'trending-post';
    if (netScore > 20) return 'popular-post';
    if (netScore < -5) return 'controversial-post';
    if (isSolution) return 'solution-post';
    return '';
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleUpvote = () => {
    setVotes(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
    if (onUpvote) onUpvote(id);
  };
  
  const handleDownvote = () => {
    setVotes(prev => ({ ...prev, downvotes: prev.downvotes + 1 }));
    if (onDownvote) onDownvote(id);
  };
  
  // Get author name regardless of author format
  const authorName = typeof author === 'string' ? author : author.name;
  const authorDetails = typeof author === 'string' ? null : author;
  
  // Calculate background color based on engagement
  const bgColor = getPostEngagementColor({ upvotes: votes.upvotes, downvotes: votes.downvotes });
  
  // Toggle bookmark
  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className={`forum-post-card rounded-xl overflow-hidden border border-opacity-40 transition-all duration-300 ${
        isSolution ? 'border-l-4 border-l-emerald-500' : ''
      } ${isTrending ? 'pulse-effect' : ''} ${getMoodClass()}`}
      style={{
        marginLeft: `${depth * 2}rem`,
        maxWidth: `calc(100% - ${depth * 2}rem)`,
        background: bgColor
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Vote Section */}
          <div className="vote-section flex flex-col items-center gap-1 pt-2">
            <motion.button 
              onClick={handleUpvote}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.5)] transition-colors text-amber-600 vote-button"
              aria-label="Resonance (Upvote)"
            >
              <ChevronUp size={24} className="vote-icon" />
            </motion.button>
            
            <motion.span 
              initial={false}
              animate={{ 
                scale: [1, 1.2, 1],
                color: netScore > 0 ? '#f59e0b' : netScore < 0 ? '#3b82f6' : '#9CA3AF' 
              }}
              transition={{ duration: 0.3 }}
              className="font-medium text-base vote-score"
            >
              {netScore}
            </motion.span>
            
            <motion.button 
              onClick={handleDownvote}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.5)] transition-colors text-blue-500 vote-button"
              aria-label="Reflection (Downvote)"
            >
              <ChevronDown size={24} className="vote-icon" />
            </motion.button>
          </div>
          
          {/* Content Section */}
          <div className="content-section flex-1">
            {/* Author Info */}
            <div className="flex justify-between items-start">
              <div>
                {title && (
                  <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2 post-title">{title}</h3>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="avatar-wrapper w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)] leading-tight author-name">{authorName}</h3>
                    {authorDetails?.role && (
                      <span className="text-xs text-[var(--text-muted)]">
                        {authorDetails.role}
                      </span>
                    )}
                  </div>
                  
                  {isSolution && (
                    <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium px-2 py-1 bg-emerald-500 bg-opacity-10 rounded-full">
                      <Check size={12} />
                      Solution
                    </span>
                  )}
                </div>
                
                {authorDetails && (
                  <div className="flex items-center text-xs text-[var(--text-muted)] mt-1">
                    <span>Joined {authorDetails.joinDate}</span>
                    <span className="mx-2">•</span>
                    <span>{authorDetails.postCount} posts</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)] timestamp">
                  {formatDate(timestamp || createdAt)}
                  {updatedAt && createdAt && updatedAt !== createdAt && ' (edited)'}
                </span>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  onClick={handleToggleBookmark}
                  className={`text-[var(--text-muted)] hover:text-amber-500 transition-colors ${isBookmarked ? 'text-amber-500' : ''}`}
                >
                  <BookmarkIcon size={16} className={isBookmarked ? 'fill-amber-500' : ''} />
                </motion.button>
                <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            
            {/* Post Content */}
            <div 
              className="mt-4 text-[var(--text-secondary)] prose prose-lg max-w-none post-content"
            >
              <p>{content}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex items-center gap-6 post-actions">
              {reactions.length > 0 && (
                <div className="relative">
                  <motion.button 
                    className="flex items-center gap-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors reaction-button"
                    onClick={() => setShowReactions(!showReactions)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Heart size={18} className={reactions.some(r => r.reacted) ? 'fill-rose-500 text-rose-500' : ''} />
                    <span className="text-sm font-medium">{reactions.reduce((sum, r) => sum + r.count, 0)}</span>
                  </motion.button>
                  
                  <AnimatePresence>
                    {showReactions && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute top-full left-0 mt-2 p-2 bg-[var(--bg-tertiary)] backdrop-blur-md bg-opacity-80 rounded-xl shadow-xl flex gap-2 z-10 reaction-popup"
                      >
                        {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                          <motion.button
                            key={emoji}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                            onClick={() => {
                              onReaction?.(id, emoji);
                              setShowReactions(false);
                            }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              <motion.button 
                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-amber-500 transition-colors action-button"
                onClick={() => {
                  setShowReplyPreview(!showReplyPreview);
                  onReply?.(id);
                }}
                whileHover={{ scale: 1.05 }}
              >
                <MessageSquare size={18} />
                <span className="text-sm font-medium">Reply</span>
              </motion.button>
              
              <motion.button 
                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-amber-500 transition-colors action-button"
                whileHover={{ scale: 1.05 }}
              >
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </motion.button>
              
              {isParent && !isSolution && (
                <motion.button 
                  className="flex items-center gap-1 text-[var(--text-muted)] hover:text-emerald-500 transition-colors ml-auto action-button"
                  onClick={() => onMarkSolution?.(id)}
                  whileHover={{ scale: 1.05 }}
                >
                  <Award size={18} />
                  <span className="text-sm font-medium">Mark as Solution</span>
                </motion.button>
              )}
            </div>
            
            {/* Reply Preview */}
            <AnimatePresence>
              {showReplyPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-[var(--border-color)] border-opacity-20"
                >
                  <div className="flex gap-3 items-start">
                    <div className="avatar-wrapper w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                      Y
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-[var(--bg-tertiary)] bg-opacity-50 reply-preview">
                      <p className="text-sm text-[var(--text-secondary)] opacity-70">
                        Start typing your reply...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
