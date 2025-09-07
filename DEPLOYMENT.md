# 🚀 Deployment Guide for Vercel

## CORS Error Fix

The CORS error you're experiencing is common when deploying Firebase apps to Vercel. Here's how to fix it:

### 1. Update Firebase Security Rules

Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Firestore Database → Rules

Replace your current rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write daily records
    match /dailyRecords/{date} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write pending users
    match /pendingUsers/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write rejected users
    match /rejectedUsers/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read all users (for admin dashboard)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Fallback rule for any other documents
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Configure Firebase for Production

The `vercel.json` file has been created to handle CORS headers properly.

### 3. Deploy to Vercel

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix CORS error for Vercel deployment"
   git push origin main
   ```

2. **Redeploy on Vercel:**
   - Go to your Vercel dashboard
   - Click "Redeploy" on your project
   - Or it will auto-deploy from your GitHub push

### 4. Test the Deployment

After deployment, test these features:
- ✅ User login/signup
- ✅ Form submission
- ✅ Admin dashboard access
- ✅ Data loading

### 5. If Issues Persist

If you still get CORS errors:

1. **Check Firebase Console:**
   - Go to Authentication → Settings → Authorized domains
   - Add your Vercel domain: `youth-app-2.vercel.app`

2. **Clear Browser Cache:**
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache and cookies

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for failed requests
   - Check if Firebase requests are going through

### 6. Environment Variables (Optional)

For better security, you can move Firebase config to environment variables:

1. **Create `.env.local`:**
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all the variables above

## Troubleshooting

### Common Issues:

1. **"Missing or insufficient permissions"**
   - Check Firestore security rules
   - Ensure user is authenticated

2. **CORS errors**
   - Update Firebase security rules
   - Check authorized domains in Firebase Console

3. **Authentication not working**
   - Verify Firebase config
   - Check if user is properly authenticated

### Support:

If you continue to have issues, check:
- Firebase Console logs
- Vercel deployment logs
- Browser console errors
- Network tab in DevTools
