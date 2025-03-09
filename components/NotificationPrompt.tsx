'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/components/Toast';

export default function NotificationPrompt() {
  const { t } = useTranslation();
  const { requestNotificationPermission } = usePWA();
  const { showToast } = useToast();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if notifications are already enabled or if the prompt was dismissed
    const checkNotificationStatus = async () => {
      const dismissed = localStorage.getItem('notificationPromptDismissed');
      if (dismissed) {
        setDismissed(true);
        return;
      }

      if ('Notification' in window && Notification.permission === 'default') {
        // Wait a bit before showing the prompt
        setTimeout(() => setShow(true), 3000);
      }
    };

    checkNotificationStatus();
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      showToast(t('notifications_enabled'), 'success');
    } else {
      showToast(t('notifications_denied'), 'error');
    }
    setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('notificationPromptDismissed', 'true');
  };

  if (!show || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 z-50">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">
            {t('enable_notifications')}
          </h3>
          <p className="text-sm text-gray-300">
            {t('enable_notifications_description')}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-gray-400 hover:text-gray-300"
          aria-label={t('close')}
        >
          ✕
        </button>
      </div>
      <div className="mt-4 flex space-x-3">
        <button
          onClick={handleEnable}
          className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          {t('enable')}
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          {t('not_now')}
        </button>
      </div>
    </div>
  );
}
