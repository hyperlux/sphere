'use client';

import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import { createClientComponentClient, createClientComponentClientWithToken } from '@/lib/supabase/client';
import CategoryCard from './CategoryCard';
import TopicItem from './TopicItem';
import TrendingSidebar from './TrendingSidebar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import CreateTopicForm from './CreateTopicForm';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

const ForumPageStatic: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/forum/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateTopic = async ({
    title,
    content,
    categoryId,
    tags,
  }: {
    title: string;
    content: string;
    categoryId: string;
    tags: string[];
  }) => {
    setIsLoading(true);
    try {
      const supabaseNoAuth = createClientComponentClient();

      const {
        data: { session },
      } = await supabaseNoAuth.auth.getSession();

      const accessToken = session?.access_token;

      console.log('Access token:', accessToken);

      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          console.log('Decoded JWT payload:', payload);
        } catch (e) {
          console.warn('Failed to decode JWT payload:', e);
        }
      }

      if (!accessToken) {
        alert('You must be logged in to create a topic.');
        setIsLoading(false);
        return;
      }

      const supabase = createClientComponentClientWithToken(accessToken);

      const res = await fetch(`/api/forum/categories/${categoryId}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, content, tags }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Create topic API error:', errorData);
        throw new Error(errorData.error || 'Failed to create topic');
      }
      const newTopic = await res.json();
      console.log('Create topic API response:', newTopic);
      setShowCreateForm(false);
      // Optionally redirect to the new topic page
      window.location.href = `/forum/topics/${newTopic.id}`;
    } catch (err) {
      console.error(err);
      alert('Failed to create topic. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const topics = [
    {
      title: 'Sustainability Workshop This Weekend',
      content: 'Join us for a hands-on workshop on sustainable practices...',
      meta: { author: 'Priya', category: 'Events', time: '2 hours ago', replies: 15 },
    },
    {
      title: 'Welcome to the Auroville Community Forum',
      content: 'Let’s discuss how we can make this forum a great place...',
      meta: { author: 'Lucas', category: 'General', time: '1 day ago', replies: 8 },
    },
    {
      title: 'Community Garden Initiative',
      content: 'Proposing a new community garden project for Auroville...',
      meta: { author: 'Amit', category: 'Sustainability', time: '3 days ago', replies: 12 },
    },
    {
      title: 'Art Exhibition Next Month',
      content: 'Join us for an art exhibition showcasing local talent...',
      meta: { author: 'Sofia', category: 'Events', time: '5 days ago', replies: 5 },
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a2b3c] text-white relative">
      <Sidebar user={null} />
      <div className="flex md:ml-64 sm:ml-20 transition-all duration-300">
        <main className="flex-1 p-4 lg:p-8 lg:pr-8">
          <Hero onCreateTopicClick={() => { console.log('Create Topic button clicked'); setShowCreateForm(true); }} />
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  icon={cat.icon || '💬'}
                  name={cat.name}
                  description={cat.description || ''}
                />
              ))}
            </div>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Recent Topics</h2>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {topics.map((topic, index) => (
                <TopicItem key={index} {...topic} />
              ))}
            </motion.ul>
          </section>
        </main>
        <TrendingSidebar />
      </div>
      <Footer />

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a2b3c] rounded-xl max-w-2xl w-full relative">
            <CreateTopicForm
              categories={categories}
              onSubmit={handleCreateTopic}
              onCancel={() => setShowCreateForm(false)}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPageStatic;
