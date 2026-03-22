import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

// Types for your data
export interface AppDetail {
  id?: string;
  name: string;
  link: string;
  description?: string;
  category?: string;
  tags?: string[];
  iconUrl?: string; // Added for app icon
  author?: string;
  version?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Collection reference
const COLLECTION_NAME = "appDetails";
const appDetailsCollection = collection(db, COLLECTION_NAME);

// Add a new app detail
export const addAppDetail = async (appDetail: Omit<AppDetail, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(appDetailsCollection, {
      ...appDetail,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding app detail:", error);
    throw error;
  }
};

// Get all app details
export const getAllAppDetails = async (): Promise<AppDetail[]> => {
  try {
    const q = query(appDetailsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AppDetail));
  } catch (error) {
    console.error("Error getting app details:", error);
    throw error;
  }
};

// Get a single app detail by ID
export const getAppDetail = async (id: string): Promise<AppDetail | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as AppDetail;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting app detail:", error);
    throw error;
  }
};

// Update an app detail
export const updateAppDetail = async (id: string, updates: Partial<AppDetail>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // First check if document exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Document exists, update it
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } else {
      // Document doesn't exist, throw error to trigger fallback
      throw new Error('No document to update: ' + docRef.path);
    }
  } catch (error) {
    console.error("Error updating app detail:", error);
    throw error;
  }
};

// Upsert an app detail (update if exists, create if not)
export const upsertAppDetail = async (id: string, appDetail: Omit<AppDetail, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // First check if document exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Document exists, update it
      await updateDoc(docRef, {
        ...appDetail,
        updatedAt: Timestamp.now()
      });
      return id;
    } else {
      // Document doesn't exist, create it with the specified ID
      const newDocRef = await addDoc(appDetailsCollection, {
        ...appDetail,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return newDocRef.id;
    }
  } catch (error) {
    console.error("Error upserting app detail:", error);
    throw error;
  }
};

// Delete an app detail
export const deleteAppDetail = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting app detail:", error);
    throw error;
  }
};

// Search app details by name
export const searchAppDetailsByName = async (searchTerm: string): Promise<AppDetail[]> => {
  try {
    const q = query(
      appDetailsCollection,
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + '\uf8ff'),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AppDetail));
  } catch (error) {
    console.error("Error searching app details:", error);
    throw error;
  }
};