'use client';

import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <motion.section
      className="bg-gradient-to-r from-[#f5a623] to-[#e69520] p-8 rounded-xl text-center mb-12 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to the Auroville Community Forum
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-white mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Connect, share, and discuss ideas with the Auroville community.
      </motion.p>
      <motion.button
        className="bg-[#0f1c2e] text-white px-8 py-4 rounded-lg hover:bg-[#2a3b4c] transition-colors shadow-lg"
        whileHover={{ scale: 1.1, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
        aria-label="Create a new topic"
      >
        Create Topic
      </motion.button>
    </motion.section>
  );
};

export default Hero;
