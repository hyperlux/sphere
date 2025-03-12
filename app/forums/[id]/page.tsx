'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PlusCircle, Filter, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ForumSidebar from '@/components/ForumSidebar';
import ForumTopicCard from '@/components/ForumTopicCard';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { mockAurovillePosts } from '@/data/mockData';

// Mock data for demonstration
const mockCategories = [
  {
    id: '1',
    name: 'Announcements',
    description: 'Official announcements from Auroville',
    icon: '📢',
    topicCount: 12
  },
  {
    id: '2',
    name: 'Community Projects',
    description: 'Discussions about ongoing and future community projects',
    icon: '🌱',
    topicCount: 28
  },
  {
    id: '3',
    name: 'Sustainability',
    description: 'Discussions about sustainable living and practices',
    icon: '♻️',
    topicCount: 45
  },
  {
    id: '4',
    name: 'Volunteer Opportunities',
    description: 'Find and offer volunteer opportunities in Auroville',
    icon: '🤝',
    topicCount: 19
  },
  {
    id: '5',
    name: 'Cultural Exchange',
    description: 'Share and discuss cultural experiences and events',
    icon: '🎭',
    topicCount: 32
  },
  {
    id: '6',
    name: 'Spiritual Growth',
    description: 'Discussions about spiritual practices and growth',
    icon: '🧘',
    topicCount: 56
  },
  {
    id: '7',
    name: 'General Discussion',
    description: 'General topics related to Auroville',
    icon: '💬',
    topicCount: 87
  }
];

const mockTopics = [
  {
    id: '101',
    title: 'New community guidelines for 2025',
    content: 'We are excited to announce the updated community guidelines for 2025. These guidelines aim to foster a more inclusive and sustainable community environment.',
    author: {
      id: 'user1',
      name: 'AuroAdmin',
      avatar: ''
    },
    createdAt: '2025-03-10T14:30:00Z',
    replyCount: 24,
    viewCount: 156,
    isPinned: true,
    isLocked: false,
    lastReply: {
      author: {
        id: 'user5',
        name: 'CommunityMember'
      },
      timestamp: '2025-03-11T10:15:00Z'
    },
    mood: 'announcement'
  },
  {
    id: '102',
    title: 'How can we improve water conservation in our community?',
    content: 'Water scarcity is becoming a pressing issue. I would like to discuss potential solutions and practices we can implement to conserve water in our daily lives.',
    author: {
      id: 'user2',
      name: 'EcoFriend',
      avatar: ''
    },
    createdAt: '2025-03-09T09:45:00Z',
    replyCount: 18,
    viewCount: 92,
    isPinned: false,
    isLocked: false,
    lastReply: {
      author: {
        id: 'user7',
        name: 'WaterExpert'
      },
      timestamp: '2025-03-11T08:20:00Z'
    },
    mood: 'question'
  },
  {
    id: '103',
    title: 'Volunteers needed for forest restoration project',
    content: 'We are looking for volunteers to help with our forest restoration project. The project will run for 3 months starting April 2025.',
    author: {
      id: 'user3',
      name: 'ForestKeeper',
      avatar: ''
    },
    createdAt: '2025-03-08T16:20:00Z',
    replyCount: 32,
    viewCount: 210,
    isPinned: false,
    isLocked: false,
    lastReply: {
      author: {
        id: 'user9',
        name: 'GreenThumb'
      },
      timestamp: '2025-03-11T11:05:00Z'
    },
    mood: 'default'
  },
  {
    id: '104',
    title: 'Traditional dance workshop this weekend',
    content: 'I am organizing a traditional dance workshop this weekend. All skill levels are welcome. Please join us for a fun and cultural experience!',
    author: {
      id: 'user4',
      name: 'DanceLover',
      avatar: ''
    },
    createdAt: '2025-03-07T11:10:00Z',
    replyCount: 15,
    viewCount: 88,
    isPinned: false,
    isLocked: false,
    lastReply: {
      author: {
        id: 'user11',
        name: 'ArtisticSoul'
      },
      timestamp: '2025-03-10T22:30:00Z'
    },
    mood: 'discussion'
  },
  {
    id: '105',
    title: 'Meditation techniques for beginners',
    content: 'I would like to share some meditation techniques that have helped me as a beginner. These are simple practices that anyone can incorporate into their daily routine.',
    author: {
      id: 'user5',
      name: 'InnerPeace',
      avatar: ''
    },
    createdAt: '2025-03-06T08:50:00Z',
    replyCount: 27,
    viewCount: 175,
    isPinned: false,
    isLocked: false,
    lastReply: {
      author: {
        id: 'user13',
        name: 'MindfulPractitioner'
      },
      timestamp: '2025-03-11T07:45:00Z'
    },
    mood: 'solved'
  }
];

const popularTags = [
  'sustainability', 'community', 'events', 'meditation', 'yoga', 
  'volunteering', 'education', 'art', 'technology', 'farming'
];

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'replies'>('recent');
  const [filterMood, setFilterMood] = useState<string>('all');
  
  // Fetch category and topics
  useEffect(() => {
    // In a real app, you would fetch from an API
    const foundCategory = mockCategories.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
      setTopics(mockTopics);
      setFilteredTopics(mockTopics);
    }
  }, [categoryId]);
  
  // Filter and sort topics
  useEffect(() => {
    if (!topics.length) return;
    
    let filtered = [...topics];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply mood filter
    if (filterMood !== 'all') {
      filtered = filtered.filter(topic => topic.mood === filterMood);
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'popular') {
        return b.viewCount - a.viewCount;
      } else {
        return b.replyCount - a.replyCount;
      }
    });
    
    // Always show pinned topics at the top
    filtered = [
      ...filtered.filter(topic => topic.isPinned),
      ...filtered.filter(topic => !topic.isPinned)
    ];
    
    setFilteredTopics(filtered);
  }, [topics, searchQuery, sortBy, filterMood]);
  
 const handleCreateTopic = () => {
    router.push(`/forum/${categoryId}/new`);
  };

  if (!category) {
    return (
      <div className="flex min-h-screen bg-[var(--bg-primary)] justify-center items-center">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

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
            <div className="flex items-center gap-4">
              <Link href="/forum" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowLeft size={20} />
              </Link>
              
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    {category.name}
                  </h1>
                  <p className="text-[var(--text-muted)]">{category.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-[var(--text-secondary)]">
                {filteredTopics.length} {filteredTopics.length === 1 ? 'topic' : 'topics'}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                >
                  <Filter size={20} />
                </button>
                
                <button
                  onClick={handleCreateTopic}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <PlusCircle size={18} />
                  <Link href={`/forum/${categoryId}/new`}>
                  <span>New Topic</span>
                  </Link>
                </button>
              </div>
            </div>
            
            <AnimatePresence>
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
                        onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'replies')}
                        className="mt-1 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2 text-[var(--text-primary)]"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Viewed</option>
                        <option value="replies">Most Replies</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[var(--text-secondary)] text-sm mb-1">
                        Topic Type:
                      </label>
                      <select
                        value={filterMood}
                        onChange={(e) => setFilterMood(e.target.value)}
                        className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-2 text-[var(--text-primary)]"
                      >
                        <option value="all">All Types</option>
                        <option value="question">Questions</option>
                        <option value="announcement">Announcements</option>
                        <option value="discussion">Discussions</option>
                        <option value="solved">Solved</option>
                        <option value="default">General</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-muted)] text-lg">No topics found matching your search.</p>
              <button
                onClick={handleCreateTopic}
                className="mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors mx-auto"
              >
                <PlusCircle size={18} />
                <span>Create the first topic</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <ForumTopicCard
                  key={topic.id}
                  id={topic.id}
                  title={topic.title}
                  content={topic.content}
                  author={topic.author}
                  createdAt={topic.createdAt}
                  replyCount={topic.replyCount}
                  viewCount={topic.viewCount}
                  isPinned={topic.isPinned}
                  isLocked={topic.isLocked}
                  lastReply={topic.lastReply}
                  mood={topic.mood}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
