// Firestore connectivity test utility
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export const testFirestoreConnection = async () => {
  try {
    console.log('🧪 Testing Firestore connection...');
    
    // Test read operation
    const testDocRef = doc(firestore, 'test', 'connection');
    const testData = {
      timestamp: serverTimestamp(),
      test: true,
      message: 'Firestore connection test'
    };
    
    // Test write operation
    await setDoc(testDocRef, testData);
    console.log('✅ Write test successful');
    
    // Test read operation
    const docSnap = await getDoc(testDocRef);
    if (docSnap.exists()) {
      console.log('✅ Read test successful:', docSnap.data());
      return { success: true, message: 'Firestore connection working' };
    } else {
      console.log('❌ Read test failed: Document not found');
      return { success: false, message: 'Document not found' };
    }
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    return { success: false, message: error.message };
  }
};

export const testUserDataAccess = async (userId) => {
  try {
    console.log('🧪 Testing user data access...');
    
    const userDocRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    
    if (userSnap.exists()) {
      console.log('✅ User data access successful:', userSnap.data());
      return { success: true, data: userSnap.data() };
    } else {
      console.log('⚠️ User document not found');
      return { success: false, message: 'User document not found' };
    }
  } catch (error) {
    console.error('❌ User data access test failed:', error);
    return { success: false, message: error.message };
  }
};
