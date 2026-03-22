# Migration Guide: SQLite to Serverless Database

## Problem
`better-sqlite3` requires native compilation and doesn't work on Vercel's serverless environment.

## Solution Options

### Option 1: Use Neon Postgres (Recommended)

1. **Create Neon Account**: https://neon.tech
2. **Create Database** in Neon dashboard
3. **Get Connection String** from Neon
4. **Add to Vercel Environment Variables**:
   ```
   DATABASE_URL=postgresql://user:password@host/database
   ```

5. **Install Package** (already done):
   ```bash
   npm install @neondatabase/serverless
   ```

6. **Migrate Schema**: Run this SQL in Neon console:
   ```sql
   CREATE TABLE apps (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     author TEXT,
     version TEXT,
     category TEXT,
     tags TEXT,
     github_link TEXT,
     download_url TEXT,
     screenshots TEXT,
     iconUrl TEXT,
     downloads INTEGER DEFAULT 0,
     featured INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE ratings (
     id SERIAL PRIMARY KEY,
     app_id INTEGER REFERENCES apps(id),
     rating INTEGER,
     review TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE app_downloads (
     id SERIAL PRIMARY KEY,
     app_id INTEGER REFERENCES apps(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

7. **Update lib/db.ts** - Replace entire file with Neon implementation

### Option 2: Deploy to Railway/Render Instead

These platforms support SQLite better:
- Railway: https://railway.app
- Render: https://render.com

No code changes needed, just deploy there instead of Vercel.

### Option 3: Use Vercel Blob Storage

For simple key-value storage, use Vercel Blob (but requires significant refactoring).

## Recommended: Option 1 (Neon)

It's the most scalable and works perfectly with Vercel.
