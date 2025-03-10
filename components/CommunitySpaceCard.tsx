'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';

interface CommunitySpaceProps {
  space: {
    id: string;
    name: string;
    description: string;
    image_url?: string;
    member_count: number;
    creator: {
      name: string;
    };
    created_at: string;
  };
  onJoin?: (spaceId: string) => Promise<void>;
  onLeave?: (spaceId: string) => Promise<void>;
  isMember?: boolean;
}

export default function CommunitySpaceCard({ 
  space, 
  onJoin, 
  onLeave, 
  isMember = false 
}: CommunitySpaceProps) {
  const { t } = useTranslation();

  const handleJoinLeave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isMember && onLeave) {
      await onLeave(space.id);
    } else if (!isMember && onJoin) {
      await onJoin(space.id);
    }
  };

  return (
    <Link href={`/community/${space.id}`}>
      <div className="dashboard-card hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
        <div className="flex items-start space-x-4">
          {/* Space Image */}
          <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden">
            {space.image_url ? (
              <Image
                src={space.image_url}
                alt={space.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
                {space.name[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Space Details */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{space.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">
              {space.description}
            </p>
            <div className="flex items-center text-sm text-[var(--text-muted)] space-x-4">
              <span>{t('members', { count: space.member_count })}</span>
              <span>•</span>
              <span>{t('created_by', { name: space.creator.name })}</span>
            </div>
          </div>

          {/* Join/Leave Button */}
          {(onJoin || onLeave) && (
            <button
              onClick={handleJoinLeave}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isMember
                  ? 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isMember ? t('leave') : t('join')}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
