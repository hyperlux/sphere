'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import RedirectToLogin from '@/components/RedirectToLogin';
import { AlertTriangle, Info, Calendar, Clock, MapPin, MessageSquare, Megaphone, ChevronUp, Heart } from 'lucide-react';
import { mockAurovillePosts, getNetScore } from '@/data/mockData';

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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={user} />
      <div className="flex flex-col min-h-screen">
        <Header user={user} visitorCount={1247} />
        
        <main className="ml-0 md:ml-64 sm:ml-20 p-6 w-[calc(100%-64px)] md:w-[calc(100%-256px)] sm:w-[calc(100%-80px)] transition-all duration-300">
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
                  {t('Latest Community Posts')}
                </h2>
                <a href="/forums" className="view-all-link">
                  {t('view all')}
                  <span>→</span>
                </a>
              </div>
              <div className="space-y-6">
                {/* Display the top 3 forum posts from our mock data, sorted by engagement */}
                {mockAurovillePosts
                  .sort((a, b) => getNetScore(b) - getNetScore(a))
                  .slice(0, 3)
                  .map((post) => (
                    <div key={post.id} className="community-post forum-post-card">
                      <div className="post-header">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-semibold">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-[var(--text-primary)] post-title">{post.title}</h3>
                              <p className="text-xs text-[var(--text-muted)]">{post.author}</p>
                            </div>
                            <span className="text-sm text-[var(--text-muted)] timestamp">
                              {new Date(post.timestamp).toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-[var(--text-secondary)] post-content line-clamp-3">
                        {post.content}
                      </p>

                      <div className="post-actions">
                        <div className="post-action">
                          <ChevronUp size={18} className={getNetScore(post) > 0 ? 'text-amber-500' : ''} />
                          <span className={getNetScore(post) > 0 ? 'text-amber-500 font-medium' : ''}>{getNetScore(post)}</span>
                        </div>

                        <div className="post-action">
                          <MessageSquare size={18} />
                          <span>{post.replies?.length || 0}</span>
                        </div>

                        <a href={`/forums/topics/${post.topicId}`} className="post-action text-amber-500 hover:underline">
                          <span>View Discussion →</span>
                        </a>
                      </div>
                    </div>
                  ))}
                
                {data.resources.map((resource) => (
                  <ContentCard key={resource.id} post={resource} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}