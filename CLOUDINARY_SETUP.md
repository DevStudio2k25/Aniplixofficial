# 🌥️ Cloudinary Setup Guide (FREE)

## Step 1: Create Free Account
1. Go to: https://cloudinary.com/users/register_free
2. Sign up with email (FREE forever - 25GB storage + 25GB bandwidth/month)
3. Verify email

## Step 2: Get Cloud Name
1. Login to: https://console.cloudinary.com/console/
2. You'll see **Dashboard**
3. Copy **Cloud Name** (e.g., `dxyz123abc`)

## Step 3: Create Upload Preset
1. Go to: **Settings** (gear icon top right)
2. Click **Upload** tab in left sidebar
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Fill:
   - **Preset name:** `apps4all`
   - **Signing Mode:** Select **Unsigned** (important!)
   - **Folder:** `app-store` (optional)
6. Click **Save**

## Step 4: Add to Vercel
Go to Vercel → Settings → Environment Variables

Add these 2 variables:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=apps4all
```

Replace `your-cloud-name-here` with your actual Cloud Name from Step 2.

## Example:
If your Cloud Name is `dxyz123abc`, add:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=apps4all
```

## ✅ Done!
Redeploy your Vercel app and image uploads will work!

---

## 💡 Free Tier Limits (More than enough!)
- ✅ 25 GB Storage
- ✅ 25 GB Bandwidth/month
- ✅ Unlimited transformations
- ✅ No credit card required
- ✅ Forever free

Perfect for your app! 🚀
