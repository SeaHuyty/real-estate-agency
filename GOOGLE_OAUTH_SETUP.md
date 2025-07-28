# 🔧 Google OAuth Setup Guide

## Current Issue: "Access blocked: Authorization Error"

This error occurs when Google OAuth is not properly configured in the Google Cloud Console.

## ✅ Step-by-Step Fix

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project or create a new one

### 2. Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" and enable it
- Also enable "Google Identity" if available

### 3. Configure OAuth Consent Screen
- Go to "APIs & Services" > "OAuth consent screen"
- Choose "External" user type
- Fill in required fields:
  - App name: "Real Estate Agency"
  - User support email: your email
  - Developer contact information: your email
- Add scopes: email, profile, openid
- Save and continue

### 4. Configure OAuth 2.0 Client IDs
- Go to "APIs & Services" > "Credentials"
- Find your OAuth 2.0 Client ID: `836600766864-7or20n94n2rcdtiopdlmdj0ut4rq3rm5.apps.googleusercontent.com`
- Click "Edit" (pencil icon)

### 5. Add Authorized JavaScript Origins
Add these URLs to "Authorized JavaScript origins":
```
http://localhost:5173
http://127.0.0.1:5173
https://localhost:5173
```

### 6. Add Authorized Redirect URIs (if needed)
Add these URLs to "Authorized redirect URIs":
```
http://localhost:5173
http://localhost:5173/auth/callback
```

### 7. Save Changes
- Click "Save" at the bottom
- Wait a few minutes for changes to propagate

## 🧪 Testing the Fix

1. Clear browser cache and cookies
2. Restart the frontend development server
3. Try logging in with Google OAuth again

## 🔍 Alternative Solutions

If the above doesn't work, try:

### Option 1: Create New OAuth Client
1. Create a new OAuth 2.0 Client ID in Google Cloud Console
2. Update the client ID in both frontend and backend

### Option 2: Check Domain Verification
1. Ensure your domain is verified in Google Search Console
2. Add your domain to the OAuth consent screen

### Option 3: Use Different Google Account
1. Try logging in with a different Google account
2. Some accounts may have restrictions

## 📝 Current Configuration

**Frontend Client ID:** `836600766864-7or20n94n2rcdtiopdlmdj0ut4rq3rm5.apps.googleusercontent.com`
**Backend Client ID:** Same as frontend
**Development URL:** `http://localhost:5173`
**API URL:** `http://localhost:3000`
