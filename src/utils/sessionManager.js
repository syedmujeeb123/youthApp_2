// Session management utility for multiple device support
import { auth } from '../config/firebase';

export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

export const getSessionInfo = () => {
  return {
    deviceId: getDeviceId(),
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    userId: auth.currentUser?.uid || null
  };
};

export const clearSession = () => {
  // Clear all session-related data
  localStorage.removeItem('deviceId');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Clear any other app-specific data
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('firebase') || key.includes('firestore')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('🧹 Session cleared');
};

export const handleMultipleDeviceLogin = (user) => {
  const sessionInfo = getSessionInfo();
  
  // Log the login event
  console.log('🔐 Multi-device login detected:', {
    userId: user.uid,
    email: user.email,
    deviceId: sessionInfo.deviceId,
    timestamp: sessionInfo.timestamp
  });
  
  // You can add logic here to:
  // 1. Track active sessions
  // 2. Send notifications to other devices
  // 3. Limit concurrent sessions
  // 4. Log security events
  
  return sessionInfo;
};

export const checkSessionValidity = () => {
  const user = auth.currentUser;
  if (!user) return false;
  
  // Check if token is still valid
  return user.getIdToken().then(() => true).catch(() => false);
};
