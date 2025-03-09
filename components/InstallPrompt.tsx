'use client';

import { useTranslation } from 'react-i18next';
import { usePWA } from '@/hooks/usePWA';
import { useState } from 'react';
import { useToast } from '@/components/Toast';

export default function InstallPrompt() {
  const { t } = useTranslation();
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const { showToast } = useToast();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    try {
      const result = await promptInstall();
      if (result?.outcome === 'accepted') {
        showToast(t('installation_success'), 'success');
      } else if (result?.outcome === 'dismissed') {
        setDismissed(true);
      }
    } catch (error) {
      console.error('Installation error:', error);
      showToast(t('installation_error'), 'error');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('installPromptDismissed', new Date().toISOString());
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 z-50">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">
            {t('install_app')}
          </h3>
          <p className="text-sm text-gray-300">
            {t('install_app_description')}
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
          onClick={handleInstall}
          className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          {t('install')}
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
