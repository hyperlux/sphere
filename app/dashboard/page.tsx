'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import RedirectToLogin from '@/components/RedirectToLogin';

interface DashboardData {
  announcements: any[];
  events: any[];
  posts: any[];
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    announcements: [],
    events: [],
    posts: []
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          return <RedirectToLogin />;
        }
        setUser(session.user);

        // Fetch dashboard data
        const [announcementsRes, eventsRes, postsRes] = await Promise.all([
          supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(2),
          supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })
            .limit(3),
          supabase
            .from('posts')
            .select('*, author:users(name)')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        setData({
          announcements: announcementsRes.data || [],
          events: eventsRes.data || [],
          posts: postsRes.data || []
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-orange-500 text-xl">{t('loading')}...</div>
      </div>
    );
  }

  if (!user) {
    return <RedirectToLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar user={user} />
      <Header user={user} visitorCount={1247} />
      
      <main className="ml-64 pt-16 p-6">
        {/* Important Announcements */}
        <section className="mb-8">
          <h2 className="dashboard-section-title">{t('important_announcements')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.announcements.map((announcement) => (
              <div key={announcement.id} className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-100">{announcement.title}</h3>
                <p className="mt-2 text-gray-300">{announcement.content}</p>
                <span className="text-sm text-gray-400 mt-4 block">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Events */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="dashboard-section-title mb-0">{t('todays_events')}</h2>
            <a href="/events" className="text-orange-500 hover:text-orange-400">{t('view_all')}</a>
          </div>
          <div className="space-y-4">
            {data.events.map((event) => (
              <div key={event.id} className="dashboard-card flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{event.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(event.date).toLocaleString()} • {event.location}
                  </p>
                </div>
                {event.status && (
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm">
                    {event.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Latest Community Posts */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="dashboard-section-title mb-0">{t('latest_community_posts')}</h2>
            <a href="/community" className="text-orange-500 hover:text-orange-400">{t('view_all')}</a>
          </div>
          <div className="space-y-6">
            {data.posts.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
