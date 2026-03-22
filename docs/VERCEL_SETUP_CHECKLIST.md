# ✅ Vercel Deployment Checklist

## 📋 Environment Variables Status

### 🔥 Firebase (REQUIRED - 7 variables)
```
✅ NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAY-zqMhazobVUKZyAR1RQpbFo3msZPF6Y
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=animetracker4lk.firebaseapp.com
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID=animetracker4lk
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=animetracker4lk.firebasestorage.app
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=229461634934
✅ NEXT_PUBLIC_FIREBASE_APP_ID=1:229461634934:web:c5b532de2f9f785c71d457
✅ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-G6F340H5VR
```

**Used in:**
- `lib/firebase.ts` - Firebase initialization
- `lib/db.ts` - Database operations
- All API routes that use Firestore

**Status:** ✅ Ready to use (values already filled)

---

### 🔐 Admin Password (REQUIRED - 1 variable)
```
✅ ADMIN_PASSWORD=2026apps4all
```

**Used in:**
- `app/api/apps/route.ts` - Create/list apps
- `app/api/apps/[id]/route.ts` - Update/delete apps
- `app/api/auth/login/route.ts` - Admin login

**Status:** ✅ Ready to use (change password for security)

---

### ☁️ Cloudinary (OPTIONAL - 2 variables)
```
⚠️ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
⚠️ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=apps4all
```

**Used in:**
- `lib/cloudinary.ts` - Image upload helper
- `components/image-upload.tsx` - Single image upload
- `components/multi-image-upload.tsx` - Multiple image upload
- `app/api/upload/route.ts` - Upload API endpoint

**Status:** ⚠️ Optional (app works without it, uses local preview)

---

## 🚀 Deployment Steps

### Step 1: Add Environment Variables in Vercel
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar
5. Add each variable:
   - Copy variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Copy variable value (e.g., `AIzaSyAY-zqMhazobVUKZyAR1RQpbFo3msZPF6Y`)
   - Select: **Production**, **Preview**, **Development** (all 3)
   - Click **Save**
6. Repeat for all 8 required variables

### Step 2: Verify Variables Added
Check that you have added:
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- [ ] ADMIN_PASSWORD

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## ✅ What Will Work

### With Firebase Variables Only:
- ✅ Homepage
- ✅ Browse apps
- ✅ Search apps
- ✅ View app details
- ✅ Download tracking
- ✅ Ratings system
- ✅ Admin panel (with ADMIN_PASSWORD)
- ✅ Add/Edit/Delete apps
- ⚠️ Image uploads (local preview only)

### With Cloudinary Added:
- ✅ Everything above
- ✅ Real image uploads to cloud
- ✅ CDN-hosted images

---

## 🔍 Troubleshooting

### If Firebase doesn't work:
1. Check all 7 Firebase variables are added
2. Check no typos in variable names
3. Check values are copied correctly
4. Redeploy after adding variables

### If Admin panel doesn't work:
1. Check ADMIN_PASSWORD is added
2. Try password: `2026apps4all`
3. Check browser console for errors

### If images don't upload:
1. This is normal without Cloudinary
2. App will show local preview
3. Add Cloudinary variables to enable real uploads

---

## 📝 Summary

**Total Variables Needed:** 8 (required) + 2 (optional)

**Required (8):**
- 7 Firebase variables ✅
- 1 Admin password ✅

**Optional (2):**
- 2 Cloudinary variables ⚠️

**All values are in:** `VERCEL_ENV_VARIABLES.txt`

**Status:** 🟢 Ready for deployment!
