import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'apps.db');
    db = new Database(dbPath);
  }
  return db;
}

export interface App {
  id: number;
  name: string;
  description: string;
  author: string;
  version: string;
  category: string;
  tags: string;
  github_link: string;
  download_url: string;
  screenshots: string;
  iconUrl?: string; // Added iconUrl field
  downloads: number;
  featured: number;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: number;
  app_id: number;
  rating: number;
  review: string | null;
  created_at: string;
}

export function getAllApps(): App[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM apps ORDER BY featured DESC, created_at DESC');
  return stmt.all() as App[];
}

export function getAppById(id: number): App | null {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM apps WHERE id = ?');
  return (stmt.get(id) as App) || null;
}

export function getFeaturedApps(limit = 6): App[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM apps WHERE featured = 1 ORDER BY created_at DESC LIMIT ?');
  return stmt.all(limit) as App[];
}

export function searchApps(query: string, category?: string): App[] {
  const database = getDb();
  let sql = 'SELECT * FROM apps WHERE (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
  const params: any[] = [`%${query}%`, `%${query}%`, `%${query}%`];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  sql += ' ORDER BY featured DESC, created_at DESC';
  const stmt = database.prepare(sql);
  return stmt.all(...params) as App[];
}

export function getCategories(): string[] {
  const database = getDb();
  const stmt = database.prepare('SELECT DISTINCT category FROM apps ORDER BY category');
  const results = stmt.all() as { category: string }[];
  return results.map(r => r.category);
}

export function addApp(app: Omit<App, 'id' | 'downloads' | 'created_at' | 'updated_at'>): App {
  const database = getDb();
  const stmt = database.prepare(
    'INSERT INTO apps (name, description, author, version, category, tags, github_link, download_url, screenshots, iconUrl, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(
    app.name,
    app.description,
    app.author,
    app.version,
    app.category,
    app.tags,
    app.github_link,
    app.download_url,
    app.screenshots,
    app.iconUrl || null,
    app.featured || 0
  );
  
  return getAppById(result.lastInsertRowid as number)!;
}

export function updateApp(id: number, app: Partial<App>): App {
  const database = getDb();
  const updates: string[] = [];
  const params: any[] = [];

  Object.entries(app).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at') {
      updates.push(`${key} = ?`);
      params.push(value);
    }
  });

  params.push(id);
  const sql = `UPDATE apps SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  const stmt = database.prepare(sql);
  stmt.run(...params);

  return getAppById(id)!;
}

export function deleteApp(id: number): boolean {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM apps WHERE id = ?');
  const result = stmt.run(id);
  return (result.changes || 0) > 0;
}

export function recordDownload(appId: number): void {
  const database = getDb();
  const stmt = database.prepare('INSERT INTO app_downloads (app_id) VALUES (?)');
  stmt.run(appId);

  const updateStmt = database.prepare('UPDATE apps SET downloads = downloads + 1 WHERE id = ?');
  updateStmt.run(appId);
}

export function getAppRatings(appId: number): Rating[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM ratings WHERE app_id = ? ORDER BY created_at DESC');
  return stmt.all(appId) as Rating[];
}

export function getAppAverageRating(appId: number): { average: number; count: number } {
  const database = getDb();
  const stmt = database.prepare('SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE app_id = ?');
  const result = stmt.get(appId) as any;
  return {
    average: result.average ? parseFloat(result.average) : 0,
    count: result.count || 0,
  };
}

export function addRating(appId: number, rating: number, review?: string): Rating {
  const database = getDb();
  const stmt = database.prepare('INSERT INTO ratings (app_id, rating, review) VALUES (?, ?, ?)');
  const result = stmt.run(appId, rating, review || null);
  
  return {
    id: result.lastInsertRowid as number,
    app_id: appId,
    rating,
    review: review || null,
    created_at: new Date().toISOString(),
  };
}
