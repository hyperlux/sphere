'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import ContentCard from '@/components/ContentCard';
import RedirectToLogin from '@/components/RedirectToLogin';
import { AlertTriangle, Info, Calendar, Clock, MapPin, MessageSquare, Megaphone } from 'lucide-react'; // Removed ChevronUp, Heart
import TopicItem from '@/components/TopicItem'; // Added TopicItem

interface DashboardData {
  announcements: any[];
  events: any[];
  resources: any[];
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    announcements: [],
    events: [],
    resources: []
  });
  const [latestTopics, setLatestTopics] = useState<any[]>([]); // Added state for topics
  // Create client instance within the component
  const [supabase] = useState(() => createClientComponentClient());

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          return <RedirectToLogin />;
        }
        setUser(session.user);

        // Fetch dashboard data (including latest topics)
        const [eventsRes, resourcesRes, topicsRes] = await Promise.all([
          supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(3),
          supabase
            .from('resources')
            .select('*, author:users(username)') // Select username instead of name
            .order('created_at', { ascending: false })
            .limit(5),
          supabase // Added query for forum topics
            .from('forum_topics')
            .select('id, slug, title, content, created_at, last_activity_at, author_id') // Select necessary fields
            .order('last_activity_at', { ascending: false }) // Order by most recent activity
            .limit(3) // Limit to 3 topics for the dashboard
        ]);

        setData({
          announcements: [],
          events: eventsRes.data || [],
          resources: resourcesRes.data || []
        });
        setLatestTopics(topicsRes.data || []); // Set the latest topics state
      } catch (error) { // Moved the closing brace '}' from line 67 to here
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-orange-500 text-xl">{t('loading')}...</div>
      </div>
    );
  }

  if (!user) {
    return <RedirectToLogin />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={user} />
      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        
        <main className="p-6 w-full transition-all duration-300">
          {/* Important Announcements */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-[var(--text-secondary)] mb-0 flex items-center">
                <Megaphone className="mr-2" size={20} />
                {t('Important Announcements')}
              </h2>
              <a href="/announcements" className="view-all-link">
                {t('view all')}
                <span>→</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="announcement-card warning">
                <div className="flex items-start">
                  <div className="text-orange-500 mr-3">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-500">Water Conservation Notice</h3>
                    <p className="mt-2 text-[var(--text-secondary)]">Due to reduced rainfall, please minimize water usage. Conservation guidelines in effect.</p>
                    <span className="text-sm text-[var(--text-muted)] mt-4 block">1 hour ago</span>
                  </div>
                </div>
              </div>
              
              <div className="announcement-card info">
                <div className="flex items-start">
                  <div className="text-blue-500 mr-3">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-500">New Community Guidelines</h3>
                    <p className="mt-2 text-[var(--text-secondary)]">Updated community participation guidelines have been released.</p>
                    <span className="text-sm text-[var(--text-muted)] mt-4 block">3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Combined Section for Today's Events and Latest Community Posts */}
          <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Events */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[var(--text-secondary)] mb-0 flex items-center">
                  <Calendar className="mr-2" size={20} />
                  {t('Todays Events')}
                </h2>
                <a href="/events" className="view-all-link">
                  {t('view all')}
                  <span>→</span>
                </a>
              </div>
              <div className="space-y-4">
                <div className="event-card">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Morning Meditation</h3>
                      <span className="badge-new">New</span>
                    </div>
                    <div className="flex mt-1 space-x-4">
                      <p className="event-time flex items-center">
                        <Clock className="mr-1" size={16} />
                        06:00 AM
                      </p>
                      <p className="event-location flex items-center">
                        <MapPin className="mr-1" size={16} />
                        Matrimandir
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="event-card">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Permaculture Workshop</h3>
                      <span className="badge-new">New</span>
                    </div>
                    <div className="flex mt-1 space-x-4">
                      <p className="event-time flex items-center">
                        <Clock className="mr-1" size={16} />
                        09:30 AM
                      </p>
                      <p className="event-location flex items-center">
                        <MapPin className="mr-1" size={16} />
                        Buddha Garden
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="event-card">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Community Lunch</h3>
                    <div className="flex mt-1 space-x-4">
                      <p className="event-time flex items-center">
                        <Clock className="mr-1" size={16} />
                        12:30 PM
                      </p>
                      <p className="event-location flex items-center">
                        <MapPin className="mr-1" size={16} />
                        Solar Kitchen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Community Posts */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[var(--text-secondary)] mb-0 flex items-center">
                  <MessageSquare className="mr-2" size={20} />
                  {t('Latest Community Topics')}
                </h2>
                <a href="/forums" className="view-all-link">
                  {t('view all')}
                  <span>→</span>
                </a>
              </div>
              <div className="space-y-6">
                {/* Display the latest 3 forum topics */}
                {latestTopics.length > 0 ? (
                  latestTopics.map((topic) => {
                    // Format data for TopicItem props
                    // Note: author, category, and replies are placeholders as they aren't fetched in this query
                    const topicData = {
                      id: topic.id,
                      slug: topic.slug,
                      title: topic.title,
                      content: topic.content, // TopicItem expects content, might need truncation later
                      meta: {
                        author: topic.author_id || 'Unknown User', // Placeholder - ideally fetch username
                        category: 'General', // Placeholder - category info not fetched
                        time: new Date(topic.last_activity_at || topic.created_at).toLocaleString(),
                        replies: 0, // Placeholder - replies count not fetched
                      },
                    };
                    return <TopicItem key={topic.id} {...topicData} />;
                  })
                ) : (
                  <p className="text-[var(--text-muted)]">No topics found.</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
