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
  id: number;
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
  id: number;
  name: string;
  description: string | null;
  created_at: string | null;
}

// Remove the getUserDisplayInfo function as it's no longer needed

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

  // Remove the call to getUserDisplayInfo

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
        .order('created_at', { ascending: true }); // Fixed: order by existing created_at column

      if (error) throw error;
      // Data should now mostly match the Event interface (except category join and creator object)
      // Manually add a default attendees_count since we removed the join
      const eventsData = ((data || []) as any[])
        .filter(e => e && typeof e === 'object' && typeof e.id === 'number' && typeof e.title === 'string')
        .map(event => ({
          ...event,
          attendees_count: 0,
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
      const rsvpMap = (data || []).reduce((acc, curr) => {
        const key = curr.event_id !== null ? String(curr.event_id) : '';
        return {
          ...acc,
          [key]: curr.status
        };
      }, {} as Record<string, string | null>);
      const filteredMap: Record<string, string> = {};
      for (const key in rsvpMap) {
        if (rsvpMap[key]) filteredMap[key] = rsvpMap[key]!;
      }
      setUserRsvps(filteredMap);
    } catch (error) {
      console.error('Error loading RSVPs:', error);
    }
  };
  

  
  const handleRsvp = async (eventId: number, status: 'attending' | 'maybe' | 'not_attending') => {
    if (!user?.id) {
      console.error("Cannot RSVP without user ID");
      return; // Or show an error message
    }

    try {
      const existingStatus = userRsvps[String(eventId)];

      if (existingStatus) {
        const { error } = await supabase
          .from('event_attendees')
          .update({ status })
          .match({ event_id: eventId, user_id: user.id });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id,
            status
          });

        if (error) throw error;
      }

      setUserRsvps(prev => ({
        ...prev,
        [String(eventId)]: status
      }));

      loadEvents();
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };
  

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">{t('loading')}...</div>;
  }

  // Update the condition to only check for user
  if (!user) {
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Pass user prop in the simplified format */}
      <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        {/* Wrap Header in fixed position div like forum page */}
        <div className="fixed top-0 md:left-64 sm:left-20 right-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          {/* Pass user prop in the simplified format */}
          <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} visitorCount={1247} />
        </div>
        {/* Add padding-top and flex-1 to main */}
        <main className="flex-1 p-6 w-full pt-24 transition-all duration-300"> 
          {/* Combined Header Row for Title and Controls */}
          <div className="flex justify-between items-center mb-6 gap-4">
            {/* Title on the left */}
            <h1 className="text-3xl font-bold text-[var(--text-primary)] whitespace-nowrap">
              {t('events')}
            </h1>

            {/* Controls grouped on the right */}
            <div className="flex items-center gap-4">
              <input
                type="search"
                placeholder={t('search_events')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
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
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap"
              >
                {t('create_event')}
              </button>
            </div>
          </div>

          {/* Event List Section */}
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
    </div>
  );
} // End of component function
