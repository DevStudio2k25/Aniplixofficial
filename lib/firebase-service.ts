import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  Timestamp 
} from 'firebase/firestore';

export interface App {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  category: string;
  tags: string;
  download_url: string;
  screenshots: string; // Store as JSON string or comma-separated
  iconUrl?: string;
  downloads: number;
  featured: number;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  app_id: string;
  rating: number;
  review: string | null;
  created_at: string;
}

const APPS_COLLECTION = 'apps';
const RATINGS_COLLECTION = 'ratings';
const DOWNLOADS_COLLECTION = 'app_downloads';

// --- Apps Operations ---

export async function getAllApps(): Promise<App[]> {
  const appsCol = collection(db, APPS_COLLECTION);
  const snapshot = await getDocs(appsCol);
  const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
  
  // Sort by featured first, then by created_at desc
  return apps.sort((a, b) => {
    if (a.featured !== b.featured) {
      return b.featured - a.featured;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function getAppById(id: string): Promise<App | null> {
  const docRef = doc(db, APPS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as App : null;
}

export async function getFeaturedApps(limitCount = 6): Promise<App[]> {
  const appsCol = collection(db, APPS_COLLECTION);
  const q = query(appsCol, where('featured', '==', 1));
  const snapshot = await getDocs(q);
  const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
  
  // Sort by created_at desc in memory
  return apps
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limitCount);
}

export async function searchApps(searchQuery: string, category?: string): Promise<App[]> {
  const appsCol = collection(db, APPS_COLLECTION);
  let q = query(appsCol);
  
  if (category) {
    q = query(appsCol, where('category', '==', category));
  }
  
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
  
  // Client-side filtering for more flexible search
  const lowerQuery = searchQuery.toLowerCase();
  return results.filter(app => 
    app.name.toLowerCase().includes(lowerQuery) ||
    app.description.toLowerCase().includes(lowerQuery) ||
    (app.tags && app.tags.toLowerCase().includes(lowerQuery))
  );
}

export async function getCategories(): Promise<string[]> {
  const appsCol = collection(db, APPS_COLLECTION);
  const snapshot = await getDocs(appsCol);
  const categories = new Set<string>();
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.category) categories.add(data.category);
  });
  return Array.from(categories).sort();
}

export async function addApp(app: Omit<App, 'id' | 'downloads' | 'created_at' | 'updated_at'>): Promise<App> {
  const appsCol = collection(db, APPS_COLLECTION);
  const timestamp = new Date().toISOString();
  
  // Clean undefined values for Firestore
  const cleanedData = Object.fromEntries(
    Object.entries(app).filter(([_, v]) => v !== undefined)
  );

  const newAppData = {
    ...cleanedData,
    downloads: 0,
    created_at: timestamp,
    updated_at: timestamp
  };
  
  console.log('Firebase: addApp data:', newAppData);
  const docRef = await addDoc(appsCol, newAppData);
  return { id: docRef.id, ...newAppData } as App;
}

export async function updateApp(id: string, app: Partial<App>): Promise<App> {
  const docRef = doc(db, APPS_COLLECTION, id);
  
  // Clean undefined values for Firestore
  const cleanedData = Object.fromEntries(
    Object.entries(app).filter(([_, v]) => v !== undefined)
  );

  await updateDoc(docRef, {
    ...cleanedData,
    updated_at: new Date().toISOString()
  });
  const updated = await getAppById(id);
  if (!updated) throw new Error('Failed to retrieve updated app');
  return updated;
}

export async function upsertApp(id: string, appData: Omit<App, 'id' | 'downloads' | 'created_at' | 'updated_at'>): Promise<App> {
  const docRef = doc(db, APPS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return updateApp(id, appData);
  } else {
    // If not exists, we use setDoc to specify the ID if possible, but addDoc is easier if ID is auto-gen
    // For upsert with specific ID, we'd use setDoc. But let's keep it simple.
    return addApp(appData);
  }
}

export async function deleteApp(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, APPS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting app:', error);
    return false;
  }
}

// --- Interaction Operations ---

export async function recordDownload(appId: string): Promise<void> {
  const docRef = doc(db, APPS_COLLECTION, appId);
  await updateDoc(docRef, {
    downloads: increment(1)
  });
  
  const downloadsCol = collection(db, DOWNLOADS_COLLECTION);
  await addDoc(downloadsCol, {
    app_id: appId,
    created_at: new Date().toISOString()
  });
}

export async function getAppRatings(appId: string): Promise<Rating[]> {
  const ratingsCol = collection(db, RATINGS_COLLECTION);
  const q = query(ratingsCol, where('app_id', '==', appId));
  const snapshot = await getDocs(q);
  const ratings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rating));
  
  // Sort by created_at desc in memory
  return ratings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getAppAverageRating(appId: string): Promise<{ average: number; count: number }> {
  const ratings = await getAppRatings(appId);
  if (ratings.length === 0) return { average: 0, count: 0 };
  
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: parseFloat((sum / ratings.length).toFixed(1)),
    count: ratings.length
  };
}

export async function addRating(appId: string, rating: number, review?: string): Promise<Rating> {
  const ratingsCol = collection(db, RATINGS_COLLECTION);
  const newRating = {
    app_id: appId,
    rating,
    review: review || null,
    created_at: new Date().toISOString()
  };
  const docRef = await addDoc(ratingsCol, newRating);
  return { id: docRef.id, ...newRating };
}
