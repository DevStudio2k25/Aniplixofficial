# Cloudinary Setup Guide

## Quick Start (Works without Cloudinary)
The app now works with or without Cloudinary! If you don't configure Cloudinary, it will use local image previews.

## Steps to configure Cloudinary for cloud storage:

### 1. Create Cloudinary Account
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up for a free account

### 2. Get Your Cloud Name
- After login, go to Dashboard
- Copy your **Cloud Name** (looks like: `dxyz123abc`)

### 3. Create Upload Preset
- Go to Settings > Upload
- Click "Add upload preset"
- Set preset name: `apps4all`
- Set signing mode to **"Unsigned"** (very important!)
- Save the preset

### 4. Update Environment Variables
Edit `.env.local` file and replace the placeholder values:

```env
# Replace 'your-cloud-name' with your actual cloud name from step 2
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=apps4all
```

### 5. Restart Development Server
```bash
npm run dev
```

## Admin Access
- Go to: `http://localhost:3000/admin`
- Password: `2026apps4all`

## How It Works:
- **With Cloudinary**: Images upload to cloud and get CDN URLs
- **Without Cloudinary**: Images work as local previews (data URLs)
- **Automatic Fallback**: If Cloudinary fails, falls back to local preview
- **No Errors**: App works regardless of Cloudinary configuration

## Features:
- ✅ Admin authentication with custom password
- ✅ App icon upload (cloud or local)
- ✅ Firebase integration for storing app details
- ✅ Modern UI with gradient colors
- ✅ Dark/Light theme support
- ✅ Works with or without Cloudinary setup