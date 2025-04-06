'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, PlusCircle } from 'lucide-react';
import ForumCategoryCard from '@/components/ForumCategoryCard';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import CreateCategoryForm from '@/components/CreateCategoryForm'; // Import the form

// Define the structure for a category based on API response
interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  slug?: string; // Add slug if returned by API
}

export default function AllCategoriesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [allCategories, setAllCategories] = useState<ForumCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ForumCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // State for modal visibility

  // Function to filter and sort categories
  const filterAndSortCategories = useCallback((query: string, categories: ForumCategory[]) => {
    let filtered = [...categories];
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(lowerCaseQuery) ||
        (category.description && category.description.toLowerCase().includes(lowerCaseQuery))
      );
    }
    // Simple sort by name by default
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredCategories(filtered);
  }, []); // No dependencies, it's a pure function based on inputs

  // Fetch categories logic
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/forum/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const data: ForumCategory[] = await response.json();
      setAllCategories(data);
      // Filter and sort immediately after fetching using the current search query
      filterAndSortCategories(searchQuery, data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setAllCategories([]); // Clear categories on error
      setFilteredCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterAndSortCategories]); // Depend on searchQuery and the filter function

  // Fetch categories from API on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // Depend on the fetch function itself

  // Re-filter when search query changes
  useEffect(() => {
    filterAndSortCategories(searchQuery, allCategories);
  }, [searchQuery, allCategories, filterAndSortCategories]);

  // Handler for when a new category is created by the form
  const handleCategoryCreated = (newCategory: ForumCategory) => {
    // Refetch all categories to ensure the list is up-to-date
    fetchCategories();
    // Optionally, you could add locally:
    // const updatedCategories = [...allCategories, newCategory];
    // setAllCategories(updatedCategories);
    // filterAndSortCategories(searchQuery, updatedCategories);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <Header
        user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null}
      />

      {/* Main content */}
      <main className="p-6 flex-1">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-4"> {/* Added flex-wrap and gap */}
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              All Forum Categories
            </h1>

            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
              </div>
              {/* Create Category Button */}
              {/* TODO: Add role-based check here if needed (e.g., only show for admins) */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                aria-label="Create new category"
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline">Create Category</span> {/* Hide text on small screens */}
              </button>
            </div>
          </div>
        </div>

        {/* Handle Loading and Error States */}
        {isLoading ? (
          <div className="text-center py-12 text-[var(--text-muted)]">Loading categories...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">Error loading categories: {error}</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)] text-lg">
              {searchQuery ? 'No categories found matching your search.' : 'No categories found.'}
            </p>
            {/* Suggest creating one if none exist and search is empty */}
            {!searchQuery && allCategories.length === 0 && (
                 <button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 text-amber-500 hover:text-amber-600 underline"
                 >
                    Create the first category?
                 </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <ForumCategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description ?? ''}
                icon={category.icon ?? '💬'}
              />
            ))}
          </div>
        )}
      </main>

      {/* Conditionally render the Create Category Form Modal */}
      {showCreateForm && (
        <CreateCategoryForm
          onClose={() => setShowCreateForm(false)}
          onCategoryCreated={handleCategoryCreated}
        />
      )}
    </div>
  );
}
