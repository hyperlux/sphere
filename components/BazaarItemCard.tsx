'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface BazaarItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null; // Accept null
    seller: { // Expect username now
      username: string;
    } | null; // Allow seller to be null
    created_at: string;
    condition: string;
    location: string | null; // Accept null
  };
  onContact?: (itemId: string) => void;
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

  const formatPrice = (price: number) => {
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
        {/* Item Image */}
        <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
              {item.name[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{item.name}</h3>
            <span className="text-lg font-bold text-orange-500">{formatPrice(item.price)}</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">
            {item.description}
          </p>
          <div className="flex items-center text-sm text-[var(--text-muted)] space-x-4">
            <span>{t('condition')}: {item.condition}</span>
            {item.location && (
              <>
                <span>•</span>
                <span>{item.location}</span>
              </>
            )}
            <span>•</span>
            {/* Display username, handle null seller */}
            <span>{t('seller')}: {item.seller?.username ?? 'N/A'}</span>
          </div>
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
