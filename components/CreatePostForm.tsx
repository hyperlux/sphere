'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Paperclip, Smile, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatePostFormProps {
  topicId: string;
  parentId?: string;
  onSubmit: (data: {
    content: string;
    topicId: string;
    parentId?: string;
  }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  isReply?: boolean;
  replyingTo?: string;
}

export default function CreatePostForm({
  topicId,
  parentId,
  onSubmit,
  onCancel,
  isLoading = false,
  isReply = false,
  replyingTo
}: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, [content]);
  
  // Update preview content
  useEffect(() => {
    // In a real app, you would use a markdown parser here
    setPreviewContent(content);
  }, [content]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!content.trim()) {
      setError('Please enter content');
      return;
    }
    
    try {
      await onSubmit({
        content: content.trim(),
        topicId,
        parentId
      });
      
      // Reset form after successful submission
      setContent('');
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden ${
        isReply ? 'shadow-md' : 'shadow-lg'
      }`}
    >
      {isReply && replyingTo && (
        <div className="px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-tertiary)]">
          <span className="text-sm text-[var(--text-muted)]">
            Replying to <span className="text-[var(--text-primary)] font-medium">{replyingTo}</span>
          </span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="block text-sm font-medium text-[var(--text-secondary)]">
              {isReply ? 'Your reply' : 'Join the discussion'}
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-orange-500 hover:text-orange-400"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
          
          {!showPreview ? (
            <textarea
              id="content"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isReply ? "Write your reply..." : "Share your thoughts..."}
              className={`w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none ${
                isReply ? 'min-h-[100px]' : 'min-h-[150px]'
              }`}
              required
            />
          ) : (
            <div
              className={`w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-primary)] prose prose-sm max-w-none ${
                isReply ? 'min-h-[100px]' : 'min-h-[150px]'
              }`}
            >
              {previewContent ? (
                <p>{previewContent}</p>
              ) : (
                <p className="text-[var(--text-muted)]">Nothing to preview</p>
              )}
            </div>
          )}
          
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              <Image size={16} />
            </button>
            <button
              type="button"
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              <Paperclip size={16} />
            </button>
            <button
              type="button"
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              <Smile size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Posting...' : isReply ? 'Post Reply' : 'Post'}
              <Send size={14} />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
