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
        const [eventsRes, resourcesRes] = await Promise.all([
          supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })
            .limit(3),
          supabase
            .from('resources')
            .select('*, author:users(name)')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        setData({
          announcements: [],
          events: eventsRes.data || [],
          resources: resourcesRes.data || []
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
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-orange-500 text-xl">{t('loading')}...</div>
      </div>
    );
  }

  if (!user) {
    return <RedirectToLogin />;
  }

  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      <Header user={user} visitorCount={1247} />
      
      <main className="ml-64 pt-24 p-6">
        {/* Important Announcements */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-secondary)] mb-4">{t('important announcements')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="announcement-card warning">
              <div className="flex items-start">
                <div className="text-orange-500 mr-3 text-xl">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-500">Water Conservation Notice</h3>
                  <p className="mt-2 text-[var(--text-secondary)]">Due to reduced rainfall, please minimize water usage. Conservation guidelines in effect.</p>
                  <span className="text-sm text-[var(--text-muted)] mt-4 block">1 hour ago</span>
                </div>
              </div>
            </div>
            
            <div className="announcement-card info">
              <div className="flex items-start">
                <div className="text-blue-500 mr-3 text-xl">ℹ️</div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-500">New Community Guidelines</h3>
                  <p className="mt-2 text-[var(--text-secondary)]">Updated community participation guidelines have been released.</p>
                  <span className="text-sm text-[var(--text-muted)] mt-4 block">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Events */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-secondary)] mb-0">
              <span className="mr-2">📅</span>
              {t('todays events')}
            </h2>
            <a href="/events" className="view-all-link">
              {t('view_all')}
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
                  <p className="event-time">
                    <span>🕒</span>
                    06:00 AM
                  </p>
                  <p className="event-location">
                    <span>📍</span>
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
                  <p className="event-time">
                    <span>🕒</span>
                    09:30 AM
                  </p>
                  <p className="event-location">
                    <span>📍</span>
                    Buddha Garden
                  </p>
                </div>
              </div>
            </div>
            
            <div className="event-card">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Community Lunch</h3>
                <div className="flex mt-1 space-x-4">
                  <p className="event-time">
                    <span>🕒</span>
                    12:30 PM
                  </p>
                  <p className="event-location">
                    <span>📍</span>
                    Solar Kitchen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Community Posts */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-secondary)] mb-0">
              <span className="mr-2">💬</span>
              {t('latest community posts')}
            </h2>
            <a href="/community" className="view-all-link">
              {t('view_all')}
              <span>→</span>
            </a>
          </div>
          <div className="space-y-6">
            <div className="community-post">
              <div className="post-header">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  SC
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[var(--text-primary)]">Sarah Chen</h3>
                    <span className="text-sm text-[var(--text-muted)]">2 hours ago</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{t('community_member')}</p>
                </div>
              </div>

              <p className="mt-2 text-[var(--text-secondary)]">
                Just finished a wonderful permaculture workshop at Buddha Garden. Amazing to see how many community members are interested in sustainable farming!
              </p>

              <div className="mt-4 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80" 
                  alt="Vegetables from garden" 
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="post-actions">
                <button className="post-action">
                  <span>🤍</span>
                  <span>45</span>
                </button>

                <button className="post-action">
                  <span>💬</span>
                  <span>12</span>
                </button>

                <button className="post-action">
                  <span>↗️</span>
                  <span>{t('share')}</span>
                </button>
              </div>
            </div>
            
            {data.resources.map((resource) => (
              <ContentCard key={resource.id} post={resource} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
