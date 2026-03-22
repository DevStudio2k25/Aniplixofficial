# 🔐 GitHub Authentication Fix

## Problem
```
Permission denied to Himanshuksnh
Error 403: Access denied
```

You're logged in as `Himanshuksnh` but trying to push to `DevStudio2k25` repository.

---

## Solution 1: Use Personal Access Token (Recommended)

### Step 1: Create Personal Access Token
1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "AppHub Upload"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Use Token to Push
```bash
# Remove old remote
git remote remove origin

# Add remote with token
git remote add origin https://YOUR_TOKEN@github.com/DevStudio2k25/Aniplixofficial.git

# Push to master branch
git push -u origin master
```

Replace `YOUR_TOKEN` with the token you copied.

---

## Solution 2: Login with Correct Account

### Option A: Use GitHub CLI
```bash
# Install GitHub CLI first: https://cli.github.com/
gh auth login
# Select: GitHub.com → HTTPS → Login with browser
# Login as DevStudio2k25
```

### Option B: Use Git Credential Manager
```bash
# Clear cached credentials
git credential-cache exit

# Or on Windows:
git credential-manager clear

# Then try push again - it will ask for login
git push -u origin master
```

---

## Solution 3: Change Repository Owner

If you want to push to your current account (Himanshuksnh):

```bash
# Remove old remote
git remote remove origin

# Add your own repository
git remote add origin https://github.com/Himanshuksnh/Aniplixofficial.git

# Push
git push -u origin master
```

---

## Quick Fix Commands

### If using DevStudio2k25 account:
```bash
# 1. Get Personal Access Token from GitHub
# 2. Run this (replace YOUR_TOKEN):
git remote set-url origin https://YOUR_TOKEN@github.com/DevStudio2k25/Aniplixofficial.git
git push -u origin master
```

### If using Himanshuksnh account:
```bash
# Create new repo on GitHub first, then:
git remote set-url origin https://github.com/Himanshuksnh/Aniplixofficial.git
git push -u origin master
```

---

## Verify Current Settings

```bash
# Check current remote
git remote -v

# Check current user
git config user.name
git config user.email
```

---

## After Successful Push

Visit your repository:
- DevStudio2k25: https://github.com/DevStudio2k25/Aniplixofficial
- Himanshuksnh: https://github.com/Himanshuksnh/Aniplixofficial

---

**Choose the solution that works best for you!** 🚀
