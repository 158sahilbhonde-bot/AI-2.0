import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const stateLanguageMap: { [key: string]: string } = {
  'Maharashtra': 'mr',
  'Gujarat': 'gu',
  'Rajasthan': 'hi',
  'Uttar Pradesh': 'hi',
  'Bihar': 'hi',
  'Madhya Pradesh': 'hi',
  'Haryana': 'hi',
  'Delhi': 'hi',
  'Jharkhand': 'hi',
  'Chhattisgarh': 'hi',
};

export const useGeoLocation = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Check if language is already set in localStorage
        const savedLanguage = localStorage.getItem('userLanguage');
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
          return;
        }

        // Try to get location from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code === 'US') {
          i18n.changeLanguage('en');
          localStorage.setItem('userLanguage', 'en');
        } else if (data.country_code === 'IN' && data.region) {
          const language = stateLanguageMap[data.region] || 'hi';
          i18n.changeLanguage(language);
          localStorage.setItem('userLanguage', language);
        } else {
          i18n.changeLanguage('en');
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        i18n.changeLanguage('en');
      }
    };

    detectLanguage();
  }, [i18n]);
};
