'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { format } from 'date-fns';

interface EventProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category?: {
      name: string;
    };
    creator: {
      name: string;
    };
    attendees_count: number;
  };
  onRsvp?: (eventId: string, status: 'attending' | 'maybe' | 'not_attending') => Promise<void>;
  userStatus?: 'attending' | 'maybe' | 'not_attending' | null;
}

export default function EventCard({ event, onRsvp, userStatus }: EventProps) {
  const { t } = useTranslation();

  const formattedDate = format(new Date(event.date), 'PPP');
  const formattedTime = format(new Date(event.date), 'p');

  const handleRsvp = async (status: 'attending' | 'maybe' | 'not_attending') => {
    if (onRsvp) {
      await onRsvp(event.id, status);
    }
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="dashboard-card hover:bg-gray-700 transition-colors">
        <div className="flex items-start space-x-4">
          {/* Calendar Icon */}
          <div className="flex-shrink-0 w-16">
            <div className="bg-orange-500 text-white rounded-lg overflow-hidden">
              <div className="text-center py-1 text-sm font-semibold bg-orange-600">
                {format(new Date(event.date), 'MMM')}
              </div>
              <div className="text-center py-2 text-2xl font-bold">
                {format(new Date(event.date), 'd')}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-100">
              {event.title}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-2 mb-2">
              {event.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="mr-1">🕒</span>
                {formattedTime}
              </div>
              <div className="flex items-center">
                <span className="mr-1">📍</span>
                {event.location}
              </div>
              {event.category && (
                <div className="flex items-center">
                  <span className="mr-1">🏷️</span>
                  {event.category.name}
                </div>
              )}
              <div className="flex items-center">
                <span className="mr-1">👥</span>
                {t('attendees', { count: event.attendees_count })}
              </div>
            </div>
          </div>

          {/* RSVP Buttons */}
          {onRsvp && (
            <div className="flex flex-col space-y-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRsvp('attending');
                }}
                className={`px-4 py-1 rounded text-sm transition-colors ${
                  userStatus === 'attending'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-green-500/20'
                }`}
              >
                {t('attending')}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRsvp('maybe');
                }}
                className={`px-4 py-1 rounded text-sm transition-colors ${
                  userStatus === 'maybe'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-yellow-500/20'
                }`}
              >
                {t('maybe')}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRsvp('not_attending');
                }}
                className={`px-4 py-1 rounded text-sm transition-colors ${
                  userStatus === 'not_attending'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-red-500/20'
                }`}
              >
                {t('not_attending')}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
