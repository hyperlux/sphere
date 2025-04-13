'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface TopicItemProps {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta: {
    author: string;
    category: string;
    time: string;
    replies: number;
  };
}

const TopicItem: React.FC<TopicItemProps> = ({ id, slug, title, content, meta }) => {
  return (
    <motion.li
      className="bg-[var(--bg-secondary)] p-6 rounded-xl mb-4 shadow-md border border-[var(--border-color)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        <Link href={`/forum/topics/${id}/${slug}`}>{title}</Link>
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{content}</p>
      <div className="text-xs text-[var(--text-secondary)]">
        <span>Posted by {meta.author} in {meta.category}</span> • <span>{meta.time}</span> •{' '}
        <span>{meta.replies} replies</span>
      </div>
    </motion.li>
  );
};

export default TopicItem;
