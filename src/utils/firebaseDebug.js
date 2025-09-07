// Firebase debugging utility
import { getApps } from 'firebase/app';

export const debugFirebaseState = () => {
  console.log('🔍 Firebase Debug Information:');
  
  // Check Firebase apps
  const apps = getApps();
  console.log('📱 Firebase Apps:', apps.length);
  apps.forEach((app, index) => {
    console.log(`  App ${index + 1}:`, {
      name: app.name,
      options: app.options
    });
  });
  
  // Check if we're in browser environment
  console.log('🌐 Browser Environment:', typeof window !== 'undefined');
  
  // Check if we're in development
  console.log('🔧 Development Mode:', process.env.NODE_ENV === 'development');
  
  return {
    appCount: apps.length,
    isBrowser: typeof window !== 'undefined',
    isDevelopment: process.env.NODE_ENV === 'development'
  };
};

export const clearFirebaseCache = () => {
  console.log('🧹 Clearing Firebase cache...');
  
  // Clear any cached data
  if (typeof window !== 'undefined') {
    // Clear localStorage items related to Firebase
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('firebase') || key.includes('firestore')) {
        localStorage.removeItem(key);
        console.log(`Removed: ${key}`);
      }
    });
  }
  
  console.log('✅ Firebase cache cleared');
};
