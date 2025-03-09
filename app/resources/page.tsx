'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RedirectToLogin from '@/components/RedirectToLogin';
import ResourceCard from '@/components/ResourceCard';
import UploadResourceForm from '@/components/UploadResourceForm';
import { User } from '@supabase/supabase-js';

interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  file_type: string;
  size_in_bytes: number;
  category?: {
    id: string;
    name: string;
  };
  author: {
    name: string;
  };
  created_at: string;
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

  const userDisplayInfo = getUserDisplayInfo(user);

  useEffect(() => {
    if (user) {
      loadResources();
      loadCategories();
    }
  }, [user]);

  const loadResources = async () => {
    try {
      console.log('Loading resources...');
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          category:resource_categories(id, name),
          author:users!author_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Resources loaded:', data);
      setResources(data || []);
      setError(null);
    } catch (error) {
      console.error('Error loading resources:', error);
      setError(t('error_loading_resources'));
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      console.log('Loading categories...');
      const { data, error } = await supabase
        .from('resource_categories')
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
      if (!resource) return;

      const { data, error } = await supabase.storage
        .from('public')
        .createSignedUrl(resource.url, 60);

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading resource:', error);
      setError(t('error_downloading'));
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gray-900 text-gray-200">{t('loading')}...</div>;
  }

  if (!user || !userDisplayInfo) {
    return <RedirectToLogin />;
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar user={userDisplayInfo} />
      <Header user={userDisplayInfo} />
      
      <main className="ml-64 pt-16 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-100">
            {t('resources')}
          </h1>
          <button
            onClick={() => setShowUploadForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {t('upload_resource')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <input
            type="search"
            placeholder={t('search_resources')}
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

        {/* Resources List */}
        {loading ? (
          <p className="text-gray-400">{t('loading')}...</p>
        ) : (
          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <p className="text-gray-400">{t('no_resources_found')}</p>
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

        {/* Upload Resource Modal */}
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
  );
}
