'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Image, Paperclip, Smile, Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreateTopicFormProps {
  categoryId?: string;
  onSubmit: (data: {
    title: string;
    content: string;
    categoryId: string;
    tags: string[];
  }) => Promise<void>;
  onCancel?: () => void;
  categories: {
    id: string;
    name: string;
  }[];
  isLoading?: boolean;
}

export default function CreateTopicForm({
  categoryId,
  onSubmit,
  onCancel,
  categories,
  isLoading = false
}: CreateTopicFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || '');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter content');
      return;
    }
    
    if (!selectedCategoryId) {
      setError('Please select a category');
      return;
    }
    
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategoryId,
        tags
      });
      
      // Reset form after successful submission
      setTitle('');
      setContent('');
      setTags([]);
      setCurrentTag('');
      
      // Do not redirect here; let the caller handle navigation
    } catch (err) {
      setError('Failed to create topic. Please try again.');
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-lg"
    >
      <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Create New Topic</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Category
          </label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-primary)]"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="block text-sm font-medium text-[var(--text-secondary)]">
              Content
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
              placeholder="Write your topic content here..."
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] min-h-[200px] resize-none"
              required
            />
          ) : (
            <div
              ref={previewRef}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-primary)] min-h-[200px] prose prose-sm max-w-none"
            >
              {previewContent ? (
                <p>{previewContent}</p>
              ) : (
                <p className="text-[var(--text-muted)]">Nothing to preview</p>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-2">
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
        </div>
        
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-md text-xs"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tags (press Enter)"
              className="flex-1 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)] transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Topic'}
            <Send size={16} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
