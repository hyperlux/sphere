'use client';

import { motion } from 'framer-motion';
import { Calendar, Leaf, MessageSquare } from 'lucide-react';

interface CategoryCardProps {
  icon: string;
  name: string;
  description: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, name, description }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    '🎉': <Calendar className="w-10 h-10 mb-4 text-white mx-auto" />,
    '🌱': <Leaf className="w-10 h-10 mb-4 text-white mx-auto" />,
    '💬': <MessageSquare className="w-10 h-10 mb-4 text-white mx-auto" />,
  };

  return (
    <motion.div
      className="bg-[#2a3b4c] p-6 rounded-xl text-center cursor-pointer"
      whileHover={{ scale: 1.05, y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      role="button"
      tabIndex={0}
    >
      {iconMap[icon]}
      <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
      <p className="text-sm text-[#a0b0c0] mb-4">{description}</p>
      <a href="#" className="text-[#f5a623] hover:underline text-sm">
        View Topics
      </a>
    </motion.div>
  );
};

export default CategoryCard;
