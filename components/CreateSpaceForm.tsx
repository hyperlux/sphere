'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface CreateSpaceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateSpaceForm({ onClose, onSuccess }: CreateSpaceFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Create client instance within the component
  const [supabase] = useState(() => createClientComponentClient());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError('You must be logged in to create a space');
      setLoading(false);
      return;
    }

    try {
      // First, create the community space
      const { data: spaceData, error: spaceError } = await supabase
        .from('communities')
        .insert({
          name: formData.name,
          description: formData.description,
          created_by: user.id
        })
        .select()
        .single();

      if (spaceError) throw spaceError;

      // If there's an image, upload it
      if (imageFile && spaceData) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `community-spaces/${spaceData.id}/cover.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Update the space with the image URL
        const { error: updateError } = await supabase
          .from('communities')
          .update({
            image_url: filePath
          })
          .eq('id', spaceData.id);

        if (updateError) throw updateError;
      }

      // Auto-join as admin
      const { error: memberError } = await supabase
        .from('space_members')
        .insert({
          space_id: spaceData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">
        {t('create_space')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
            {error}
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('space_image')}
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24 bg-gray-700 rounded-lg overflow-hidden">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-3xl">+</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-400">
              {t('drag_drop_or_click')}
            </p>
          </div>
        </div>

        {/* Space Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {t('space_name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Space Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {t('space_description')}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-orange-500"
          />
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
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? t('creating') : t('create_space')}
          </button>
        </div>
      </form>
    </div>
  );
}
