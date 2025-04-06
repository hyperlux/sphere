'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';
import EventCard from '@/components/EventCard';
import CreateEventForm from '@/components/CreateEventForm';
import { User } from '@supabase/supabase-js';

interface Event {
  id: string;
  title: string;
  description: string | null;
  date?: string; // Make optional to match DB type
  location: string | null;
  category?: {
    id: string;
    name: string;
  };
  // creator: { // Remove creator object for now
  //   username: string;
  // } | null;
  created_by: string | null; // Store the ID instead
  attendees_count: number | null; // Allow null based on query result type
  category_id: string | null; // Add category_id based on query
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
  // Create client instance within the component
  const [supabase] = useState(() => createClientComponentClient());

  const userDisplayInfo = getUserDisplayInfo(user);

  useEffect(() => {
    if (user) {
      loadEvents(); // Re-enable
      loadCategories();
      loadUserRsvps(); // Re-enable
      // setLoading(false); // Loading is handled within loadEvents now
    } else {
       setLoading(false); // Set loading false if no user
    }
  }, [user]); // Add loadEvents, loadUserRsvps to dependencies if needed after defining them

  // Uncomment functions
  
  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          category_id,
          created_by
        `)
        // attendees_count will be handled by default/placeholder in EventCard for now
        .order('date', { ascending: true }); // Ordering by 'date' might fail if column doesn't exist

      if (error) throw error;
      // Data should now mostly match the Event interface (except category join and creator object)
      // Manually add a default attendees_count since we removed the join
      const eventsData = (data || []).map(event => ({
        ...event,
        attendees_count: 0, // Default to 0
      }));
      setEvents(eventsData as Event[]); // Cast might still be needed
    } catch (error) {
      console.error('Error loading events:', error);
    } finally { setLoading(false); } // Restore finally block
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
    if (!user?.id) return; // Don't run if user ID is not available

    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('event_id, status')
        .eq('user_id', user.id); // Now we know user.id exists

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
    if (!user?.id) {
      console.error("Cannot RSVP without user ID");
      return; // Or show an error message
    }

    try {
      const existingStatus = userRsvps[eventId];

      if (existingStatus) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_attendees')
          .update({ status })
          .match({ event_id: eventId, user_id: user.id }); // Use user.id

        if (error) throw error;
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id, // Add required user_id
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
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">{t('loading')}...</div>;
  }

  if (!user || !userDisplayInfo) {
    return <RedirectToLogin />;
  }

  const filteredEvents = events.filter(event => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch = event.title.toLowerCase().includes(lowerCaseQuery) ||
      (event.description && event.description.toLowerCase().includes(lowerCaseQuery));
    // Adjust category filtering to use category_id directly
    const matchesCategory = !selectedCategory || event.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Sidebar user={userDisplayInfo} />
      <Header user={userDisplayInfo} />
      
      <main className="ml-80 pt-32 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
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
            className="flex-1 max-w-lg px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
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
        {/* Restore event list rendering */}
        {loading ? (
          <p className="text-[var(--text-muted)]">{t('loading')}...</p>
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
                  loadEvents(); // Re-enable call
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
