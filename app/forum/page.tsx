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
import { mockAurovillePosts } from '@/data/mockData';

// Generate latest activity from mock posts
const generateLatestActivity = () => {
  const latestActivities: { [key: string]: any } = {};
  
  mockAurovillePosts.forEach(post => {
    const category = getCategoryFromTopicId(post.topicId);
    const timestamp = new Date(post.timestamp);
    
    if (!latestActivities[category] || 
        new Date(latestActivities[category].timestamp) < timestamp) {
      latestActivities[category] = {
        topicTitle: post.title,
        username: post.author,
        timestamp: formatTimeAgo(post.timestamp)
      };
    }
  });
  
  return latestActivities;
};

// Helper to format time ago string
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

// Helper to get category from topic ID
const getCategoryFromTopicId = (topicId: string): string => {
  if (topicId.startsWith('general')) return '7';
  if (topicId.startsWith('announcements')) return '1';
  if (topicId.startsWith('sustainability')) return '3';
  if (topicId.startsWith('volunteer')) return '4';
  if (topicId.startsWith('cultural')) return '5';
  if (topicId.startsWith('spiritual')) return '6';
  return '2'; // Default to Community Projects
};

// Get topic counts from mock data
const getTopicCounts = () => {
  const counts: { [key: string]: number } = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0
  };
  
  mockAurovillePosts.forEach(post => {
    const category = getCategoryFromTopicId(post.topicId);
    counts[category] = (counts[category] || 0) + 1;
  });
  
  return counts;
};

// Calculate trending categories based on post activity
const determineTrending = () => {
  const trending: { [key: string]: boolean } = {};
  const categoryScores: { [key: string]: number } = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0
  };
  
  mockAurovillePosts.forEach(post => {
    const category = getCategoryFromTopicId(post.topicId);
    // Calculate score based on upvotes, downvotes, and recency
    const daysSincePost = (new Date().getTime() - new Date(post.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    const score = (post.upvotes - post.downvotes) * Math.max(0, 7 - daysSincePost) / 7;
    categoryScores[category] += score;
  });
  
  // Mark top 2 categories as trending
  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(entry => entry[0]);
  
  sortedCategories.forEach(categoryId => {
    trending[categoryId] = true;
  });
  
  return trending;
};

// Prepare the data
const latestActivity = generateLatestActivity();
const topicCounts = getTopicCounts();
const trendingCategories = determineTrending();

// Enhanced mock data with dynamic information
const mockCategories = [
  {
    id: '1',
    name: 'Announcements',
    description: 'Official announcements from Auroville',
    icon: '📢',
    topicCount: topicCounts['1'] || 2,
    latestActivity: latestActivity['1'] || {
      topicTitle: 'New community guidelines for 2025',
      username: 'AuroAdmin',
      timestamp: '2 hours ago'
    },
    isTrending: !!trendingCategories['1']
  },
  {
    id: '2',
    name: 'Community Projects',
    description: 'Discussions about ongoing and future community projects',
    icon: '🌱',
    topicCount: topicCounts['2'] || 2,
    latestActivity: latestActivity['2'] || {
      topicTitle: 'API Integration for Resource Sharing Platform',
      username: 'AmitCode',
      timestamp: '4 hours ago'
    },
    isTrending: !!trendingCategories['2']
  },
  {
    id: '3',
    name: 'Sustainability',
    description: 'Discussions about sustainable living and practices',
    icon: '♻️',
    topicCount: topicCounts['3'] || 2,
    latestActivity: latestActivity['3'] || {
      topicTitle: 'Water conservation techniques',
      username: 'DeepakWater',
      timestamp: '1 day ago'
    },
    isTrending: !!trendingCategories['3']
  },
  {
    id: '4',
    name: 'Volunteer Opportunities',
    description: 'Find and offer volunteer opportunities in Auroville',
    icon: '🤝',
    topicCount: topicCounts['4'] || 2,
    latestActivity: latestActivity['4'] || {
      topicTitle: 'Volunteers needed for forest restoration',
      username: 'MayaGreen',
      timestamp: '3 days ago'
    },
    isTrending: !!trendingCategories['4']
  },
  {
    id: '5',
    name: 'Cultural Exchange',
    description: 'Share and discuss cultural experiences and events',
    icon: '🎭',
    topicCount: topicCounts['5'] || 2,
    latestActivity: latestActivity['5'] || {
      topicTitle: 'Traditional dance workshop this weekend',
      username: 'LeelaHarmony',
      timestamp: '12 hours ago'
    },
    isTrending: !!trendingCategories['5']
  },
  {
    id: '6',
    name: 'Spiritual Growth',
    description: 'Discussions about spiritual practices and growth',
    icon: '🧘',
    topicCount: topicCounts['6'] || 2,
    latestActivity: latestActivity['6'] || {
      topicTitle: 'Meditation techniques for beginners',
      username: 'PriyaEarth',
      timestamp: '5 hours ago'
    },
    isTrending: !!trendingCategories['6']
  },
  {
    id: '7',
    name: 'General Discussion',
    description: 'General topics related to Auroville',
    icon: '💬',
    topicCount: topicCounts['7'] || 2,
    latestActivity: latestActivity['7'] || {
      topicTitle: 'Ideas for Expanding the Solar Kitchen?',
      username: 'SolarPrakash',
      timestamp: '1 hour ago'
    },
    isTrending: !!trendingCategories['7']
  }
];

const popularTags = [
  'sustainability', 'community', 'events', 'meditation', 'yoga', 
  'volunteering', 'education', 'art', 'technology', 'farming'
];

export default function ForumPage() {
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
    router.push('/forum/new');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <ForumSidebar 
        categories={mockCategories}
        popularTags={popularTags}
        onCreateTopic={handleCreateTopic}
      />
      
      <div className="transition-all duration-300 w-full" style={{ marginLeft: '280px' }} id="content-wrapper">
        <Script src="/forum/forum-layout.js" strategy="afterInteractive" />
        <link rel="stylesheet" href="/forum/forum-layout.css" />
        <Header user={user ? { email: user.email || '', name: user.user_metadata?.name } : null} />
        
        <main className="p-6 container mx-auto max-w-full">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 forum-category-grid">
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
