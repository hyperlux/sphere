'use client';

import { motion } from 'framer-motion';

interface TopicItemProps {
  title: string;
  content: string;
  meta: {
    author: string;
    category: string;
    time: string;
    replies: number;
  };
}

const TopicItem: React.FC<TopicItemProps> = ({ title, content, meta }) => {
  return (
    <motion.li
      className="bg-[#2a3b4c] p-6 rounded-xl mb-4 shadow-md border border-[#3a4b5c]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#a0b0c0] mb-4">{content}</p>
      <div className="text-xs text-[#a0b0c0]">
        <span>Posted by {meta.author} in {meta.category}</span> • <span>{meta.time}</span> •{' '}
        <span>{meta.replies} replies</span>
      </div>
    </motion.li>
  );
};

export default TopicItem;
