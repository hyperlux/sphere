'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';
import ResourceCard from '@/components/ResourceCard';
import UploadResourceForm from '@/components/UploadResourceForm';
import { User } from '@supabase/supabase-js';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  file_type: string | null;
  size_in_bytes: number | null;
  category_id: string | null; // Store category ID from query
  author_id: string | null; // Store author ID from query
  author: { // Expect username
    username: string;
  } | null; // Allow null
  created_at: string;
  // Add category object back if needed later after fixing join/fetching category name
  // category?: {
  //   id: string;
  //   name: string;
  // };
}

interface Category {
  id: number; // Assuming number based on other category tables
  name: string;
  description: string | null;
  created_at: string | null;
}

// Helper function to get display info
function getUserDisplayInfo(user: User | null) {
  if (!user) return null;
  return {
    email: user.email || 'No email',
    name: user.user_metadata?.name
  };
}

export default function ResourcesPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  // Create client instance within the component
  const [supabase] = useState(() => createClientComponentClient());

  const userDisplayInfo = getUserDisplayInfo(user);

  useEffect(() => {
    if (user) {
      loadResources();
      loadCategories();
    } else {
      setLoading(false); // Set loading false if no user
    }
  }, [user]);

  const loadResources = async () => {
    setLoading(true); // Ensure loading state is set at the start
    try {
      console.log('Loading resources...');
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          category_id,
          author_id
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Resources loaded:', data);
      // Map data safely, setting potentially missing relational objects to null
      const resourcesData = ((data || []) as any[])
        .filter(r => r && typeof r === 'object')
        .map(resource => ({
          ...resource,
          author: null, // Placeholder until author join is fixed/verified
          category: undefined, // Placeholder until category join is fixed/verified
        }));

      setResources(resourcesData as Resource[] || []);
      setError(null);
    } catch (error) {
      console.error('Error loading resources:', error);
      setError(t('error loading resources'));
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      console.log('Loading categories...');
      const { data, error } = await supabase
        .from('resource_categories') // Assuming this is the correct table name
        .select('*')
        .order('name');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Categories loaded:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Don't set error state for categories to allow the page to still function
    }
  };

  const handleDownload = async (resourceId: string) => {
    try {
      const resource = resources.find(r => r.id === resourceId);
      if (!resource || !resource.url) {
        setError(t('error_resource_url_missing'));
        return;
      }

      // Assuming resource.url is the path within the bucket
      const filePath = resource.url; 

      const { data, error } = await supabase.storage
        .from('public') // Assuming 'public' bucket, adjust if needed
        .createSignedUrl(filePath, 60); // Generate signed URL for the file path

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading resource:', error);
      setError(t('error_downloading'));
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">{t('loading')}...</div>;
  }

  if (!user || !userDisplayInfo) {
    return <RedirectToLogin />;
  }

  const filteredResources = resources.filter(resource => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch = resource.title.toLowerCase().includes(lowerCaseQuery) ||
      (resource.description && resource.description.toLowerCase().includes(lowerCaseQuery));
    // Filter using category_id directly
    const matchesCategory = !selectedCategory || resource.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={userDisplayInfo} />
      <div className="flex flex-col min-h-screen md:ml-64 sm:ml-20 transition-all duration-300">
        <Header user={userDisplayInfo} />
        <main className="p-6 w-full transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              {t('resources')}
            </h1>
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {t('upload resource')}
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
              placeholder={t('search resources')}
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
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-[var(--text-muted)]">{t('loading')}...</p>
          ) : (
            <div className="space-y-4">
              {filteredResources.length === 0 ? (
                <p className="text-[var(--text-muted)] pl-5">{t('no resources found')}</p>
              ) : (
                filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onDownload={handleDownload}
                  />
                ))
              )}
            </div>
          )}

          {showUploadForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="max-w-lg w-full">
                <UploadResourceForm
                  categories={categories}
                  onClose={() => setShowUploadForm(false)}
                  onSuccess={() => {
                    setShowUploadForm(false);
                    loadResources();
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
