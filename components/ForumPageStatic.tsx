'use client';

import Hero from './Hero';
import CategoryCard from './CategoryCard';
import TopicItem from './TopicItem';
import TrendingSidebar from './TrendingSidebar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const ForumPageStatic: React.FC = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#1a2b3c] text-white">
      <Sidebar user={null} />
      <div className="flex md:ml-64 sm:ml-20 transition-all duration-300">
        <main className="flex-1 p-4 lg:p-8 lg:pr-8">
          <Hero />
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CategoryCard icon="🎉" name="Events" description="Upcoming events in Auroville" />
              <CategoryCard icon="🌱" name="Sustainability" description="Discussions on sustainable living" />
              <CategoryCard icon="💬" name="General" description="General discussions about Auroville" />
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
    </div>
  );
};

export default ForumPageStatic;
