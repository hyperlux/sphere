'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';
import EventCard from '@/components/EventCard';
import CreateEventForm from '@/components/CreateEventForm';
import { User } from '@supabase/supabase-js';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category?: {
    id: string;
    name: string;
  };
  creator: {
    name: string;
  };
  attendees_count: number;
}

interface Category {
  id: string;
  name: string;
}

function getUserDisplayInfo(user: User | null) {
  if (!user) return null;
  return {
    email: user.email || 'No email',
    name: user.user_metadata?.name
  };
}

export default function EventsPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userRsvps, setUserRsvps] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const userDisplayInfo = getUserDisplayInfo(user);

  useEffect(() => {
    if (user) {
      loadEvents();
      loadCategories();
      loadUserRsvps();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          category:event_categories(id, name),
          creator:users!creator_id(name),
          attendees_count:event_attendees(count)
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('event_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadUserRsvps = async () => {
    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('event_id, status')
        .eq('user_id', user?.id);

      if (error) throw error;
      const rsvpMap = (data || []).reduce((acc, curr) => ({
        ...acc,
        [curr.event_id]: curr.status
      }), {});
      setUserRsvps(rsvpMap);
    } catch (error) {
      console.error('Error loading RSVPs:', error);
    }
  };

  const handleRsvp = async (eventId: string, status: 'attending' | 'maybe' | 'not_attending') => {
    try {
      const existingStatus = userRsvps[eventId];
      
      if (existingStatus) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_attendees')
          .update({ status })
          .match({ event_id: eventId, user_id: user?.id });
          
        if (error) throw error;
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            status
          });
          
        if (error) throw error;
      }

      // Update local state
      setUserRsvps(prev => ({
        ...prev,
        [eventId]: status
      }));

      // Refresh events to update counts
      loadEvents();
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gray-900 text-gray-200">{t('loading')}...</div>;
  }

  if (!user || !userDisplayInfo) {
    return <RedirectToLogin />;
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar user={userDisplayInfo} />
      <Header user={userDisplayInfo} />
      
      <main className="ml-64 pt-16 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-100">
            {t('events')}
          </h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {t('create_event')}
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <input
            type="search"
            placeholder={t('search_events')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-lg px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
          >
            <option value="">{t('all_categories')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Events List */}
        {loading ? (
          <p className="text-gray-400">{t('loading')}...</p>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRsvp={handleRsvp}
                userStatus={userRsvps[event.id] as 'attending' | 'maybe' | 'not_attending' | undefined}
              />
            ))}
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
              <CreateEventForm
                categories={categories}
                onClose={() => setShowCreateForm(false)}
                onSuccess={() => {
                  setShowCreateForm(false);
                  loadEvents();
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
