'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateCategoryFormProps {
  onClose: () => void;
  onCategoryCreated: (newCategory: any) => void; // Callback after successful creation
}

export default function CreateCategoryForm({ onClose, onCategoryCreated }: CreateCategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(''); // Simple text input for icon/emoji for now
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError('Category name is required.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/forum/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          icon: icon.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to create category: ${response.statusText}`);
      }

      // Call the callback function with the new category data
      onCategoryCreated(result);
      onClose(); // Close the form/modal on success

    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Create New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., General Discussion"
            />
          </div>
          <div>
            <label htmlFor="category-description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Description (Optional)
            </label>
            <textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="A brief description of the category"
            />
          </div>
          <div>
            <label htmlFor="category-icon" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Icon (Optional, e.g., Emoji: 💬)
            </label>
            <input
              type="text"
              id="category-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={5} // Limit icon length
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="💬"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-color)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
