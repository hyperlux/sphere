'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';
import CommunitySpaceCard from '@/components/CommunitySpaceCard';
import CreateSpaceForm from '@/components/CreateSpaceForm';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface CommunitySpace {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  member_count: number;
  creator: {
    name: string;
  };
  created_at: string;
}

interface HeaderProps {
  user: {
    email: string;
    name?: string;
  };
}

interface SidebarProps {
  user: {
    email: string;
    name?: string;
  };
}

function getUserDisplayInfo(user: User | null) {
  if (!user) return null;
  return {
    email: user.email || 'No email',
    name: user.user_metadata?.name
  };
}

export default function CommunitySpaces() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [spaces, setSpaces] = useState<CommunitySpace[]>([]);
  const [memberships, setMemberships] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userDisplayInfo = getUserDisplayInfo(user);

  useEffect(() => {
    if (user) {
      loadSpaces();
      loadMemberships();
    }
  }, [user]);

  const loadSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          creator:users!created_by(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSpaces(data || []);
    } catch (error: any) {
      console.error('Error loading spaces:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMemberships = async () => {
    try {
      const { data, error } = await supabase
        .from('space_members')
        .select('space_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setMemberships(new Set(data?.map(m => m.space_id)));
    } catch (error) {
      console.error('Error loading memberships:', error);
    }
  };

  const handleJoinSpace = async (spaceId: string) => {
    try {
      const { error } = await supabase
        .from('space_members')
        .insert({
          space_id: spaceId,
          role: 'member'
        });

      if (error) throw error;

      setMemberships(prev => new Set([...prev, spaceId]));
      loadSpaces(); // Refresh member count
    } catch (error) {
      console.error('Error joining space:', error);
    }
  };

  const handleLeaveSpace = async (spaceId: string) => {
    try {
      const { error } = await supabase
        .from('space_members')
        .delete()
        .match({ space_id: spaceId, user_id: user?.id });

      if (error) throw error;

      setMemberships(prev => {
        const newSet = new Set(prev);
        newSet.delete(spaceId);
        return newSet;
      });
      loadSpaces(); // Refresh member count
    } catch (error) {
      console.error('Error leaving space:', error);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">{t('loading')}...</div>;
  }

  if (!user || !userDisplayInfo) {
    return <RedirectToLogin />;
  }

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Sidebar user={userDisplayInfo} />
      <Header user={userDisplayInfo} />
      
      <main className="ml-80 pt-32 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mr-4">
            {t('Forum')}
          </h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {t('Create Space')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="search"
            placeholder={t('Search Spaces')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Spaces List */}
        {loading ? (
          <p className="text-[var(--text-muted)]">{t('loading')}...</p>
        ) : (
          <div className="space-y-4">
            {filteredSpaces.map((space) => (
              <CommunitySpaceCard
                key={space.id}
                space={space}
                onJoin={handleJoinSpace}
                onLeave={handleLeaveSpace}
                isMember={memberships.has(space.id)}
              />
            ))}
          </div>
        )}

        {/* Create Space Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
              <CreateSpaceForm
                onClose={() => setShowCreateForm(false)}
                onSuccess={() => {
                  setShowCreateForm(false);
                  loadSpaces();
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
