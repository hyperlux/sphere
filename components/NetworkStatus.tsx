'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function NetworkStatus() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Show reconnected message briefly
      setIsReconnecting(false);
      setTimeout(() => setShowOffline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    const checkConnection = async () => {
      try {
        setIsReconnecting(true);
        const response = await fetch('/api/health');
        if (response.ok) {
          setIsOnline(true);
          setIsReconnecting(false);
          setTimeout(() => setShowOffline(false), 3000);
        }
      } catch (error) {
        setIsOnline(false);
        setIsReconnecting(false);
        setShowOffline(true);
      }
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection periodically when offline
    let intervalId: NodeJS.Timeout;
    if (!isOnline) {
      intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline]);

  if (!showOffline) return null;

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50
      px-4 py-2 text-center text-sm font-medium
      transition-colors duration-200
      ${isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
    `}>
      {isOnline ? (
        t('back_online')
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <span>{t('offline_mode')}</span>
          {isReconnecting && (
            <span className="inline-block animate-spin">⟳</span>
          )}
        </div>
      )}
    </div>
  );
}
