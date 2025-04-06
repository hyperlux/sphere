'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';
import BazaarItemCard from '@/components/BazaarItemCard';
import ListItemForm from '@/components/ListItemForm';
import { User } from '@supabase/supabase-js';

interface BazaarItem {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  user_id: string | null;
  votes: number | null;
  created_at: string | null;
  // Add seller info if needed after fixing join
}

// Remove getUserDisplayInfo function

export default function BazaarPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<BazaarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showListForm, setShowListForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<{ visible: boolean; sellerId?: string }>({
    visible: false
  });
  // Create client instance within the component
  const [supabase] = useState(() => createClientComponentClient());

  // Remove userDisplayInfo variable

  useEffect(() => {
    if (user) {
      loadItems();
    } else {
      setLoading(false); // Set loading false if no user
    }
  }, [user]);

  const loadItems = async () => {
    setLoading(true); // Ensure loading state is set
    try {
      console.log('Loading bazaar items...');
      // NOTE: This query will still fail if 'bazaar_items' table doesn't exist or isn't in types.
      // Fixing the user join part first.
      const { data, error } = await supabase
        .from('bazaar_items')
        .select(`
          *,
          seller:users!seller_id(username) 
        `) // Assuming 'seller_id' is the foreign key column name
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Bazaar items loaded:', data);
      // Map data safely, potentially adding seller info if join works
      const itemsData = ((data || []) as any[])
        .filter(i => i && typeof i === 'object')
        .map(item => ({
          ...item,
          // seller: item.seller ? item.seller.username : 'Unknown Seller' // Example mapping if join works
        }));

      setItems(itemsData as BazaarItem[] || []);
      setError(null);
    } catch (error) {
      console.error('Error loading bazaar items:', error);
      setError(t('error loading items'));
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async (itemId: number) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      // In a real app, you might want to fetch the seller's contact info
      // or open a chat interface. For now, we'll just show a modal with
      // placeholder text.
      // Use seller username if available (assuming join worked and was mapped)
      setContactInfo({
        visible: true,
        sellerId: 'Unknown Seller' // Placeholder
      });
    } catch (error) {
      console.error('Error contacting seller:', error);
      setError(t('error contacting seller'));
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">{t('loading')}...</div>;
  }

  // Update check to only use user
  if (!user) { 
    return <RedirectToLogin />;
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) : false);
    const matchesCondition = true; // condition removed from schema
    return matchesSearch && matchesCondition;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Pass simplified user object */}
      <Sidebar user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        {/* Wrap Header in fixed div */}
        <div className="fixed top-0 md:left-64 sm:left-20 right-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          {/* Pass simplified user object */}
          <Header user={user ? { email: user.email || '', name: user.user_metadata?.name || '' } : null} />
        </div>
        {/* Add padding-top to main */}
        <main className="p-6 w-full pt-24 transition-all duration-300"> 
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              {t('Bazaar')}
            </h1>
            <button
              onClick={() => setShowListForm(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {t('list item')}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <div className="mb-6 flex gap-4">
            <input
              type="search"
              placeholder={t('search items')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-lg px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
            />
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
            >
              <option value="">{t('all conditions')}</option>
              <option value="new">{t('new')}</option>
              <option value="like_new">{t('like new')}</option>
              <option value="good">{t('good')}</option>
              <option value="used">{t('used')}</option>
              <option value="for_parts">{t('for parts')}</option>
            </select>
          </div>

          {loading ? (
            <p className="text-[var(--text-muted)]">{t('loading')}...</p>
          ) : (
            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <p className="text-[var(--text-muted)] pl-5">{t('no items found')}</p>
              ) : (
                filteredItems.map((item) => (
                  <BazaarItemCard
                    key={item.id}
                    item={item}
                    onContact={handleContact}
                  />
                ))
              )}
            </div>
          )}

          {showListForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="max-w-lg w-full">
                <ListItemForm
                  onClose={() => setShowListForm(false)}
                  onSuccess={() => {
                    setShowListForm(false);
                    loadItems();
                  }}
                />
              </div>
            </div>
          )}

          {contactInfo.visible && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-[var(--bg-secondary)] rounded-lg shadow-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {t('contact seller')}
                  </h2>
                  <button
                    onClick={() => setContactInfo({ visible: false })}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[var(--text-primary)] mb-4">
                  {t('contact seller message', { seller: contactInfo.sellerId })}
                </p>
                <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg mb-4">
                  <p className="text-[var(--text-secondary)]">
                    {t('email')}: seller@example.com
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    {t('phone')}: +1 234 567 8900
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setContactInfo({ visible: false })}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} // End of component function
