'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface BazaarItemProps {
  item: {
    id: number;
    title: string;
    description: string | null;
    price: number | null;
    user_id: string | null;
    votes: number | null;
    created_at: string | null;
  };
  onContact?: (itemId: number) => void;
}

export default function BazaarItemCard({ 
  item, 
  onContact
}: BazaarItemProps) {
  const { t } = useTranslation();

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onContact) {
      onContact(item.id);
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return t('N/A');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="dashboard-card hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
      <div className="flex items-start space-x-4">
        {/* Item Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
            <span className="text-lg font-bold text-orange-500">{formatPrice(item.price)}</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">
            {item.description ?? ''}
          </p>
        </div>

        {/* Contact Button */}
        {onContact && (
          <button
            onClick={handleContact}
            className="px-4 py-2 rounded-lg transition-colors bg-orange-500 hover:bg-orange-600 text-white"
          >
            {t('contact')}
          </button>
        )}
      </div>
    </div>
  );
}
