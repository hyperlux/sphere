'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Post {
  id: string;
  username: string;
  content: string;
  media_url?: string;
  likes: number;
  comments: number;
  created_at: string;
  author?: {
    avatar?: string;
  };
}

export default function ContentCard({ post }: { post: Post }) {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  
  const formatTime = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      return t('just_now');
    } else if (hours < 24) {
      return t('hours_ago', { count: hours });
    } else {
      return postDate.toLocaleDateString();
    }
  };

  return (
    <div className="dashboard-card">
      <div className="flex">
        <div className="flex-shrink-0">
          {post.author?.avatar ? (
            <Image
              src={post.author.avatar}
              alt={post.username}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
              {post.username[0].toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-100">{post.username}</h3>
            <span className="text-sm text-gray-400">{formatTime(post.created_at)}</span>
          </div>
          
          <p className="mt-2 text-gray-300">{post.content}</p>
          
          {post.media_url && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <Image
                src={post.media_url}
                alt="Post media"
                width={500}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="mt-4 flex items-center space-x-6">
            <button
              onClick={() => setLiked(!liked)}
              className="flex items-center space-x-1 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <span>{liked ? '❤️' : '🤍'}</span>
              <span>{liked ? post.likes + 1 : post.likes}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-400 hover:text-orange-500 transition-colors">
              <span>💬</span>
              <span>{post.comments}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-400 hover:text-orange-500 transition-colors">
              <span>↗️</span>
              <span>{t('share')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
