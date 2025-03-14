'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

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
    <div className="community-post">
      <div className="post-header">
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
              {post.username && post.username.length > 0 ? post.username[0].toUpperCase() : ''}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-[var(--text-primary)]">{post.username}</h3>
            <span className="text-sm text-[var(--text-muted)]">{formatTime(post.created_at)}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{t('community_member')}</p>
        </div>
      </div>

      <p className="mt-2 text-[var(--text-secondary)]">{post.content}</p>

      {post.media_url && (
        <div className="mt-4 rounded-lg overflow-hidden">
          <Image
            src={post.media_url}
            alt="Post media"
            width={500}
            height={300}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div className="post-actions">
        <button
          onClick={() => setLiked(!liked)}
          className="post-action"
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current text-red-500' : ''}`} />
          <span>{liked ? post.likes + 1 : post.likes}</span>
        </button>

        <button className="post-action">
          <MessageSquare className="w-5 h-5" />
          <span>{post.comments}</span>
        </button>

        <button className="post-action">
          <Share2 className="w-5 h-5" />
          <span>{t('share')}</span>
        </button>
      </div>
    </div>
  );
}
