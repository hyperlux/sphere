'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthProvider';
// Import the new client creation function
import { createClientComponentClient } from '@/lib/supabase/client';

interface ListItemFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ListItemForm({ onClose, onSuccess }: ListItemFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('used');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Create client instance within the component
  const [supabase] = useState(() => createClientComponentClient());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError(t('must be logged in'));
      return;
    }

    if (!name || !description || !price) {
      setError(t('please fill all required fields'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageUrl = null;

      // Upload image if provided
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `bazaar/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, image);

        if (uploadError) throw uploadError;
        imageUrl = filePath;
      }

      // Insert bazaar item
      const { error: insertError } = await supabase
        .from('bazaar_items')
        .insert({
          title: name,
          description,
          price: parseFloat(price),
          user_id: user.id
        });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: any) {
      console.error('Error listing item:', err);
      setError(err.message || t('error listing item'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          {t('list item for sale')}
        </h2>
        <button
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Item Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {t('item name')} *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {t('description')} *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {t('price')} (€) *
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {t('condition')} *
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
              required
            >
              <option value="new">{t('new')}</option>
              <option value="like_new">{t('like new')}</option>
              <option value="good">{t('good')}</option>
              <option value="used">{t('used')}</option>
              <option value="for_parts">{t('for parts')}</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {t('location')}
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {t('image')}
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-quaternary)]"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? t('listing') + '...' : t('list item')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
