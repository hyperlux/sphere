'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import ForumSidebar from '@/components/ForumSidebar';
import ForumCategoryCard from '@/components/ForumCategoryCard';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';

// Mock data for demonstration
const mockCategories = [
  {
    id: '1',
    name: 'Announcements',
    description: 'Official announcements from Auroville',
    icon: '📢',
    topicCount: 12,
    latestActivity: {
      topicTitle: 'New community guidelines',
      username: 'AuroAdmin',
      timestamp: '2 hours ago'
    },
    isTrending: false
  },
  {
    id: '2',
    name: 'Community Projects',
    description: 'Discussions about ongoing and future community projects',
    icon: '🌱',
    topicCount: 28,
    latestActivity: {
      topicTitle: 'Solar panel installation project',
      username: 'GreenTech',
      timestamp: '4 hours ago'
    },
    isTrending: true
  },
  {
    id: '3',
    name: 'Sustainability',
    description: 'Discussions about sustainable living and practices',
    icon: '♻️',
    topicCount: 45,
    latestActivity: {
      topicTitle: 'Water conservation techniques',
      username: 'EcoFriend',
      timestamp: '1 day ago'
    },
    isTrending: false
  },
  {
    id: '4',
    name: 'Volunteer Opportunities',
    description: 'Find and offer volunteer opportunities in Auroville',
    icon: '🤝',
    topicCount: 19,
    latestActivity: {
      topicTitle: 'Volunteers needed for forest restoration',
      username: 'ForestKeeper',
      timestamp: '3 days ago'
    },
    isTrending: false
  },
  {
    id: '5',
    name: 'Cultural Exchange',
    description: 'Share and discuss cultural experiences and events',
    icon: '🎭',
    topicCount: 32,
    latestActivity: {
      topicTitle: 'Traditional dance workshop this weekend',
      username: 'DanceLover',
      timestamp: '12 hours ago'
    },
    isTrending: true
  },
  {
    id: '6',
    name: 'Spiritual Growth',
    description: 'Discussions about spiritual practices and growth',
    icon: '🧘',
    topicCount: 56,
    latestActivity: {
      topicTitle: 'Meditation techniques for beginners',
      username: 'InnerPeace',
      timestamp: '5 hours ago'
    },
    isTrending: false
  },
  {
    id: '7',
    name: 'General Discussion',
    description: 'General topics related to Auroville',
    icon: '💬',
    topicCount: 87,
    latestActivity: {
      topicTitle: 'What brought you to Auroville?',
      username: 'NewComer',
      timestamp: '1 hour ago'
    },
    isTrending: false
  }
];

const popularTags = [
  'sustainability', 'community', 'events', 'meditation', 'yoga', 
  'volunteering', 'education', 'art', 'technology', 'farming'
];

export default function ForumsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'topics'>('activity');
  const [filterTrending, setFilterTrending] = useState(false);
  
  // Filter and sort categories based on search query and sort option
  useEffect(() => {
    let filtered = mockCategories;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply trending filter
    if (filterTrending) {
      filtered = filtered.filter(category => category.isTrending);
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'topics') {
        return b.topicCount - a.topicCount;
      } else {
        // Sort by activity (most recent first)
        const aTime = new Date(a.latestActivity?.timestamp || '').getTime();
        const bTime = new Date(b.latestActivity?.timestamp || '').getTime();
        return bTime - aTime;
      }
    });
    
    setFilteredCategories(filtered);
  }, [searchQuery, sortBy, filterTrending]);
  
  const handleCreateTopic = () => {
    router.push('/forums/new');
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <ForumSidebar 
        categories={mockCategories}
        popularTags={popularTags}
        onCreateTopic={handleCreateTopic}
      />
      
      <div className="flex-1 ml-[280px]">
        <Header user={user ? { email: user.email || '', name: user.user_metadata?.name } : null} />
        
        <main className="p-6">
          <div className="mb-6 flex flex-col gap-4">
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
                  {filterTrending && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
                  )}
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
                      onChange={(e) => setSortBy(e.target.value as 'name' | 'activity' | 'topics')}
                      className="mt-1 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2 text-[var(--text-primary)]"
                    >
                      <option value="activity">Recent Activity</option>
                      <option value="name">Name</option>
                      <option value="topics">Topic Count</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[var(--text-secondary)] text-sm mb-1">
                      Filters:
                    </label>
                    <label className="flex items-center gap-2 text-[var(--text-primary)]">
                      <input
                        type="checkbox"
                        checked={filterTrending}
                        onChange={(e) => setFilterTrending(e.target.checked)}
                        className="rounded border-[var(--border-color)]"
                      />
                      Trending categories only
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-muted)] text-lg">No categories found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCategories.map((category) => (
                <ForumCategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  description={category.description}
                  icon={category.icon}
                  topicCount={category.topicCount}
                  latestActivity={category.latestActivity}
                  isTrending={category.isTrending}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
