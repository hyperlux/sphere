'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ForumSidebar from '@/components/ForumSidebar';
import CreateTopicForm from '@/components/CreateTopicForm';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

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

const popularTags = [
  'sustainability', 'community', 'events', 'meditation', 'yoga', 
  'volunteering', 'education', 'art', 'technology', 'farming'
];

export default function NewTopicPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch category
  useEffect(() => {
    // In a real app, you would fetch from an API
    const foundCategory = mockCategories.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
    }
  }, [categoryId]);
  
  const handleSubmit = async (data: {
    title: string;
    content: string;
    categoryId: string;
    tags: string[];
  }) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, you would call an API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the category page
      router.push(`/forums/${categoryId}`);
    } catch (error) {
      console.error('Error creating topic:', error);
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    router.push(`/forums/${categoryId}`);
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
        onCreateTopic={() => {}}
      />
      
      <div className="flex-1 ml-[280px]">
        <Header user={user ? { email: user.email || '', name: user.user_metadata?.name } : null} />
        
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/forums/${categoryId}`} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowLeft size={20} />
              </Link>
              
              <div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span className="text-xl">{category.icon}</span>
                  <Link href={`/forums/${categoryId}`} className="hover:text-[var(--text-primary)] transition-colors">
                    {category.name}
                  </Link>
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  Create New Topic
                </h1>
              </div>
            </div>
          </div>
          
          <CreateTopicForm
            categoryId={categoryId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            categories={mockCategories}
            isLoading={isSubmitting}
          />
        </main>
      </div>
    </div>
  );
}
