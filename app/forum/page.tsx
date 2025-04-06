'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { PlusCircle, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import ForumSidebar from '@/components/ForumSidebar';
import ForumCategoryCard from '@/components/ForumCategoryCard';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
// Removed mock data import and related functions/constants

// Define the structure for a category based on API response
interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  // Properties like topicCount, latestActivity, isTrending are removed as they are not in the API response yet
}

// Removed popularTags constant as it's not used with real data yet

export default function ForumPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  // State for fetched categories, loading, and error
  const [allCategories, setAllCategories] = useState<ForumCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ForumCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  // Simplify sorting - only by name for now
  const [sortBy, setSortBy] = useState<'name'>('name');
  // Remove filterTrending state

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/forum/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        const data: ForumCategory[] = await response.json();
        setAllCategories(data);
        setFilteredCategories(data); // Initialize filtered list
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []); // Fetch only once on mount

  // Filter and sort categories based on search query and sort option
  useEffect(() => {
    let filtered = [...allCategories]; // Start with all fetched categories

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(lowerCaseQuery) ||
        (category.description && category.description.toLowerCase().includes(lowerCaseQuery)) // Check if description exists before searching
      );
    }
    
    // Apply sorting (only by name for now)
    if (sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Add other sorting options here later if needed

    setFilteredCategories(filtered);
  }, [searchQuery, sortBy, allCategories]); // Re-run filter/sort when search, sort, or base data changes

  const handleCreateTopic = () => {
    // Standardize route to create new topics
    router.push('/forum/topics/new');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Sidebar - Pass fetched categories */}
      {/* TODO: Update ForumSidebar props if necessary */}
      <ForumSidebar
        categories={allCategories} // Pass all fetched categories
        popularTags={[]} // Pass empty array for now
        onCreateTopic={handleCreateTopic}
      />

      {/* Main content area */}
      <div className="flex-1">
        {/* Include scripts and styles */}
        <Script src="/forum/forum-layout.js" strategy="afterInteractive" />
        <link rel="stylesheet" href="/forum/forum-layout.css" />
        
        {/* Content area with proper sidebar offset */}
        <div className="md:ml-64 sm:ml-20 transition-all duration-300">
          {/* Header in the properly offset area */}
          <Header 
            user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null}
          />
          
          {/* Main content */}
          <main className="p-6">
            <div className="mb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  Forum Categories
                </h1>
                
                <div className="flex items-center gap-3">
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
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors relative"
                  >
                    <Filter size={20} />
                    {/* Remove trending indicator for now */}
                  </button>

                  <button
                    onClick={handleCreateTopic}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <PlusCircle size={18} />
                    <span>New Topic</span>
                  </button>
                </div>
              </div>
              
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                        <SlidersHorizontal size={16} />
                        Sort by:
                      </label>
                      <select
                        value={sortBy}
                        // Only allow sorting by name for now
                        onChange={(e) => setSortBy(e.target.value as 'name')}
                        className="mt-1 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2 text-[var(--text-primary)]"
                      >
                        {/* <option value="activity">Recent Activity</option> */}
                        <option value="name">Name</option>
                        {/* <option value="topics">Topic Count</option> */}
                      </select>
                    </div>

                    {/* Remove Trending Filter UI */}
                  </div>
                </motion.div>
              )}
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
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCategories.map((category) => (
                  // Update ForumCategoryCard props to match fetched data
                  <ForumCategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description={category.description ?? ''} // Handle null description
                    icon={category.icon ?? '💬'} // Provide default icon
                    // Remove props not available from API yet
                    // topicCount={0}
                    // latestActivity={null}
                    // isTrending={false}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
