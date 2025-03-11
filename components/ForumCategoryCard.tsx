'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForumCategoryProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicCount: number;
  latestActivity?: {
    topicTitle: string;
    username: string;
    timestamp: string;
  };
  isTrending?: boolean;
}

export default function ForumCategoryCard({
  id,
  name,
  description,
  icon,
  topicCount,
  latestActivity,
  isTrending = false
}: ForumCategoryProps) {
  return (
    <motion.div
