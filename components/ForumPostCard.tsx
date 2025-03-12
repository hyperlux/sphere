'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Share2, MoreHorizontal, Check, Award, ChevronUp, ChevronDown } from 'lucide-react';
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
  
  // Update votes when props change
  useEffect(() => {
    setVotes({ upvotes, downvotes });
  }, [upvotes, downvotes]);
  
  const netScore = votes.upvotes - votes.downvotes;
  const isTrending = netScore > 30;
  
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className={`auroville-post-card rounded-xl overflow-hidden border border-[var(--border-color)] transition-all duration-300 ${
        isSolution ? 'border-l-4 border-l-green-500' : ''
      } ${isTrending ? 'pulse-effect' : ''}`}
      style={{
        marginLeft: `${depth * 2}rem`,
        boxShadow: isHovered ? '0 8px 25px -10px var(--bg-tertiary)' : '0 4px 15px -10px var(--bg-tertiary)',
        maxWidth: `calc(100% - ${depth * 2}rem)`,
        background: bgColor
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Vote Section */}
          <div className="vote-section flex flex-col items-center gap-1 pt-2">
            <button 
              onClick={handleUpvote}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.5)] transition-colors text-amber-600"
              aria-label="Resonance (Upvote)"
            >
              <span className="text-lg">🌸</span>
            </button>
            
            <span className={`font-medium text-sm ${
              netScore > 0 ? 'text-amber-600' : 
              netScore < 0 ? 'text-blue-500' : 
              'text-[var(--text-muted)]'
            }`}>
              {netScore}
            </span>
            
            <button 
              onClick={handleDownvote}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.5)] transition-colors text-blue-500"
              aria-label="Reflection (Downvote)"
            >
              <span className="text-lg">🍂</span>
            </button>
          </div>
          
          {/* Content Section */}
          <div className="content-section flex-1">
            {/* Author Info */}
            <div className="flex justify-between items-start">
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                )}
                
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">{authorName}</h3>
                  {authorDetails?.role && (
                    <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded-full text-xs">
                      {authorDetails.role}
                    </span>
                  )}
                  {isSolution && (
                    <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
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
                <span className="text-xs text-[var(--text-muted)]">
                  {formatDate(timestamp || createdAt)}
                  {updatedAt && createdAt && updatedAt !== createdAt && ' (edited)'}
                </span>
                <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            
            {/* Post Content */}
            <div 
              className="mt-4 text-[var(--text-secondary)] prose prose-sm max-w-none"
              style={{ 
                padding: '1rem',
                borderRadius: '0.5rem',
                background: isTrending ? 'radial-gradient(circle at center, rgba(255, 183, 77, 0.1) 0%, transparent 70%)' : 'transparent'
              }}
            >
              <p>{content}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-4">
              {reactions.length > 0 && (
                <div className="relative">
                  <button 
                    className="flex items-center gap-1 text-[var(--text-muted)] hover:text-orange-500 transition-colors"
                    onClick={() => setShowReactions(!showReactions)}
                  >
                    <span className="text-lg">❤️</span>
                    <span className="text-sm">{reactions.reduce((sum, r) => sum + r.count, 0)}</span>
                  </button>
                  
                  <AnimatePresence>
                    {showReactions && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute top-full left-0 mt-2 p-2 bg-[var(--bg-tertiary)] rounded-lg shadow-lg flex gap-2 z-10"
                      >
                        {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                          <button
                            key={emoji}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                            onClick={() => {
                              onReaction?.(id, emoji);
                              setShowReactions(false);
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              <button 
                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-orange-500 transition-colors"
                onClick={() => onReply?.(id)}
              >
                <MessageSquare size={16} />
                <span className="text-sm">Reply</span>
              </button>
              
              <button className="flex items-center gap-1 text-[var(--text-muted)] hover:text-orange-500 transition-colors">
                <Share2 size={16} />
                <span className="text-sm">Share</span>
              </button>
              
              {isParent && !isSolution && (
                <button 
                  className="flex items-center gap-1 text-[var(--text-muted)] hover:text-green-500 transition-colors ml-auto"
                  onClick={() => onMarkSolution?.(id)}
                >
                  <Award size={16} />
                  <span className="text-sm">Mark as Solution</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
