'use client';

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';

interface UploadResourceFormProps {
  onClose: () => void;
  onSuccess: () => void;
  categories: Array<{
    id: number;
    name: string;
  }>;
}

export default function UploadResourceForm({ 
  onClose, 
  onSuccess, 
  categories 
}: UploadResourceFormProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Create client instance within the component
  const [supabase] = useState(() => createClientComponentClient());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: ''
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getFileType = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || 'unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError(t('please_select_file'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Upload the file
      const fileExt = getFileType(selectedFile.name);
      const filePath = `resources/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create resource record
      const { error: resourceError } = await supabase
        .from('resources')
        .insert({
          title: formData.title,
          description: formData.description,
          url: filePath,
          file_type: fileExt,
          size_in_bytes: selectedFile.size,
          category_id: formData.category_id || null
        });

      if (resourceError) throw resourceError;

      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">
        {t('upload resource')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
            {error}
          </div>
        )}

        {/* File Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('resource_file')}
          </label>
          <div
            onClick={triggerFileInput}
            className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-6 cursor-pointer hover:border-orange-500 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-center">
              {selectedFile ? (
                <div className="text-gray-200">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-gray-400">
                  <p>{t('drag_drop_or_click')}</p>
                  <p className="text-sm mt-1">{t('max_file_size')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resource Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {t('resource_title')}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Resource Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {t('resource_description')}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category_id"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {t('category')}
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
          >
            <option value="">{t('select_category')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={loading || !selectedFile}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? t('uploading') : t('upload')}
          </button>
        </div>
      </form>
    </div>
  );
}
