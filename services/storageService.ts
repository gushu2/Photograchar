import { GalleryPhoto, SearcherProfile } from '../types';

const DB_NAME = 'PhotogracharDB';
const STORE_PHOTOS = 'photos';
const STORE_SEARCHERS = 'searchers';
const DB_VERSION = 2; // Incremented for new store

let dbPromise: Promise<IDBDatabase> | null = null;

const getDB = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create Photos Store
        if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
          const store = db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create Searchers Store (New in v2)
        if (!db.objectStoreNames.contains(STORE_SEARCHERS)) {
          const store = db.createObjectStore(STORE_SEARCHERS, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }
  return dbPromise;
};

// --- Photo Operations ---

export const savePhotos = async (photos: GalleryPhoto[]): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_PHOTOS, 'readwrite');
    const store = transaction.objectStore(STORE_PHOTOS);

    photos.forEach(photo => {
      store.put(photo);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getRecentPhotos = async (limit: number = 20): Promise<GalleryPhoto[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_PHOTOS, 'readonly');
    const store = transaction.objectStore(STORE_PHOTOS);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev');
    
    const results: GalleryPhoto[] = [];
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor && results.length < limit) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
};

export const getPhotoCount = async (): Promise<number> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_PHOTOS, 'readonly');
    const store = transaction.objectStore(STORE_PHOTOS);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const iteratePhotos = async (
  callback: (photo: GalleryPhoto, index: number) => Promise<void | boolean>
): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_PHOTOS, 'readonly');
    const store = transaction.objectStore(STORE_PHOTOS);
    const request = store.openCursor();
    
    let index = 0;

    request.onsuccess = async (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const photo = cursor.value;
        const shouldContinue = await callback(photo, index);
        
        if (shouldContinue !== false) {
            index++;
            cursor.continue();
        } else {
            resolve();
        }
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const getAllPhotoIds = async (): Promise<string[]> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_PHOTOS, 'readonly');
        const store = transaction.objectStore(STORE_PHOTOS);
        const request = store.getAllKeys();
        request.onsuccess = () => resolve(request.result as string[]);
        request.onerror = () => reject(request.error);
    });
};

export const getPhotoById = async (id: string): Promise<GalleryPhoto | undefined> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_PHOTOS, 'readonly');
        const store = transaction.objectStore(STORE_PHOTOS);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const clearGallery = async (): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_PHOTOS, 'readwrite');
    const store = transaction.objectStore(STORE_PHOTOS);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// --- Searcher (User Log) Operations ---

export const saveSearcher = async (name: string, email: string): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SEARCHERS, 'readwrite');
    const store = transaction.objectStore(STORE_SEARCHERS);
    
    const profile: SearcherProfile = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name,
      email,
      timestamp: Date.now()
    };

    const request = store.put(profile);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getSearchers = async (): Promise<SearcherProfile[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    // Check if store exists (in case older DB version hasn't updated in memory)
    if (!db.objectStoreNames.contains(STORE_SEARCHERS)) {
      resolve([]);
      return;
    }

    const transaction = db.transaction(STORE_SEARCHERS, 'readonly');
    const store = transaction.objectStore(STORE_SEARCHERS);
    const index = store.index('timestamp');
    const request = index.getAll(); // Get all records

    request.onsuccess = () => {
      // Return sorted by newest first
      const results = (request.result as SearcherProfile[]).sort((a, b) => b.timestamp - a.timestamp);
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
};