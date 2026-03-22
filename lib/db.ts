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
  github_link: string;
  download_url: string;
  screenshots: string;
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

export async function getAllApps(): Promise<App[]> {
  const appsCol = collection(db, 'apps');
  const q = query(appsCol, orderBy('featured', 'desc'), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
}

export async function getAppById(id: string): Promise<App | null> {
  const docRef = doc(db, 'apps', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as App : null;
}

export async function getFeaturedApps(limitCount = 6): Promise<App[]> {
  const appsCol = collection(db, 'apps');
  const q = query(appsCol, where('featured', '==', 1), orderBy('created_at', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
}

export async function searchApps(searchQuery: string, category?: string): Promise<App[]> {
  const appsCol = collection(db, 'apps');
  let q = query(appsCol);
  
  if (category) {
    q = query(appsCol, where('category', '==', category));
  }
  
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
  
  // Client-side filtering for search
  return results.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

export async function getCategories(): Promise<string[]> {
  const appsCol = collection(db, 'apps');
  const snapshot = await getDocs(appsCol);
  const categories = new Set<string>();
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.category) categories.add(data.category);
  });
  return Array.from(categories).sort();
}

export async function addApp(app: Omit<App, 'id' | 'downloads' | 'created_at' | 'updated_at'>): Promise<App> {
  const appsCol = collection(db, 'apps');
  const newApp = {
    ...app,
    downloads: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const docRef = await addDoc(appsCol, newApp);
  return { id: docRef.id, ...newApp } as App;
}

export async function updateApp(id: string, app: Partial<App>): Promise<App> {
  const docRef = doc(db, 'apps', id);
  await updateDoc(docRef, {
    ...app,
    updated_at: new Date().toISOString()
  });
  return getAppById(id) as Promise<App>;
}

export async function deleteApp(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'apps', id);
    await deleteDoc(docRef);
    return true;
  } catch {
    return false;
  }
}

export async function recordDownload(appId: string): Promise<void> {
  const docRef = doc(db, 'apps', appId);
  await updateDoc(docRef, {
    downloads: increment(1)
  });
  
  const downloadsCol = collection(db, 'app_downloads');
  await addDoc(downloadsCol, {
    app_id: appId,
    created_at: new Date().toISOString()
  });
}

export async function getAppRatings(appId: string): Promise<Rating[]> {
  const ratingsCol = collection(db, 'ratings');
  const q = query(ratingsCol, where('app_id', '==', appId), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rating));
}

export async function getAppAverageRating(appId: string): Promise<{ average: number; count: number }> {
  const ratings = await getAppRatings(appId);
  if (ratings.length === 0) return { average: 0, count: 0 };
  
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: sum / ratings.length,
    count: ratings.length
  };
}

export async function addRating(appId: string, rating: number, review?: string): Promise<Rating> {
  const ratingsCol = collection(db, 'ratings');
  const newRating = {
    app_id: appId,
    rating,
    review: review || null,
    created_at: new Date().toISOString()
  };
  const docRef = await addDoc(ratingsCol, newRating);
  return { id: docRef.id, ...newRating };
}
