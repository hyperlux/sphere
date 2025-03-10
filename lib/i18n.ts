import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // Auth
        welcome: 'Welcome to AuroNet',
        tagline: "Where Auroville's spirit meets digital collaboration",
        login: 'Login',
        signup: 'Sign Up',
        sign_out: 'Sign Out',
        loading: 'Loading',

        // Navigation & Common
        dashboard: 'Dashboard',
        community: 'Community',
        events: 'Events',
        resources: 'Resources',
        external_resources: 'External Resources',
        official_website: 'Official Website',
        directory: 'Directory',
        community_member: 'Community Member',
        cancel: 'Cancel',
        create: 'Create',
        creating: 'Creating...',
        uploading: 'Uploading...',
        upload: 'Upload',
        download: 'Download',
        close: 'Close',
        not_now: 'Not Now',
        install: 'Install',
        enable: 'Enable',

        // Network Status
        offline_mode: 'You are offline. Some features may be limited.',
        back_online: 'You are back online!',
        reconnecting: 'Attempting to reconnect...',
        connection_error: 'Connection error. Please check your network.',
        offline_changes_saved: 'Changes will be synced when you are back online',
        sync_complete: 'All changes have been synced',

        // Installation and PWA
        install_app: 'Install AuroNet',
        install_app_description: 'Install AuroNet for a better experience with offline access and faster loading times.',
        installation_ready: 'Ready to install',
        installation_success: 'AuroNet has been installed successfully!',
        installation_error: 'There was an error installing AuroNet. Please try again.',

        // Notifications
        enable_notifications: 'Enable Notifications',
        enable_notifications_description: 'Stay updated with community events, announcements, and messages.',
        notifications_enabled: 'Notifications enabled successfully!',
        notifications_denied: 'Notification permission was denied.',
        notifications: 'Notifications',
        no_notifications: 'No new notifications',
         notification_settings: 'Notification Settings',
        notification_types: {
          events: 'Event notifications',
          community: 'Community updates',
          messages: 'Direct messages'
        },
        todays_events: 'Todays events',
        latest_community_posts: 'Latest community posts',
        announcements: 'Important announcements'
      }
    },
    ta: {
      translation: {
        // Tamil translations
        welcome: 'ஆரோநெட்டுக்கு வரவேற்கிறோம்',
        tagline: 'ஆரோவிலின் ஆன்மா டிஜிட்டல் ஒத்துழைப்பை சந்திக்கிறது',
        loading: 'ஏற்றுகிறது...',
        error_occurred: 'பிழை ஏற்பட்டது',
        try_again: 'மீண்டும் முயற்சிக்கவும்',
        install_app: 'ஆரோநெட்டை நிறுவுக',
        install: 'நிறுவு',
        not_now: 'பின்னர்',
        enable: 'இயக்கு',
        close: 'மூடு',

        // Network Status (Tamil)
        offline_mode: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள்',
        back_online: 'இணைப்பு மீண்டும் கிடைத்துள்ளது!',
        reconnecting: 'மீண்டும் இணைக்க முயற்சிக்கிறது...'
      }
    },
    fr: {
      translation: {
        // French translations
        welcome: 'Bienvenue sur AuroNet',
        tagline: "Là où l'esprit d'Auroville rencontre la collaboration numérique",
        loading: 'Chargement...',
        error_occurred: "Une erreur s'est produite",
        try_again: 'Veuillez réessayer',
        install_app: "Installer l'application",
        install: 'Installer',
        not_now: 'Plus tard',
        enable: 'Activer',
        close: 'Fermer',

        // Network Status (French)
        offline_mode: 'Vous êtes hors ligne',
        back_online: 'Vous êtes de nouveau en ligne !',
        reconnecting: 'Tentative de reconnexion...'
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
