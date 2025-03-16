/**
 * Utility for managing offline data storage and synchronization
 */

// Define the interface for database configurations
interface DBConfig {
  name: string;
  version: number;
  stores: Record<string, string>;
}

// Database configurations
const KNOWLEDGE_DB: DBConfig = {
  name: 'offlineKnowledgeDb',
  version: 1,
  stores: {
    articles: 'id',
    pendingUpdates: 'id,timestamp'
  }
};

const WORKFLOW_DB: DBConfig = {
  name: 'offlineWorkflowDb',
  version: 1,
  stores: {
    workflows: 'id',
    pendingUpdates: 'id,timestamp'
  }
};

const COMMUNITY_DB: DBConfig = {
  name: 'offlineCommunityDb',
  version: 1,
  stores: {
    posts: 'id',
    comments: 'id,postId',
    pendingUpdates: 'id,timestamp'
  }
};

// ServiceWorker sync registration interface
interface SyncRegistration extends ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
  }
}

// Pending update interface
export interface PendingUpdate {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
  attempts?: number;
}

// Background sync tags
export const SYNC_TAGS = {
  KNOWLEDGE: 'sync-knowledge-updates',
  WORKFLOW: 'sync-workflow-updates',
  COMMUNITY: 'sync-community-updates'
};

// Open a database connection
const openDatabase = (dbConfig: DBConfig) => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbConfig.name, dbConfig.version);
    
    request.onerror = () => {
      reject(new Error(`Failed to open ${dbConfig.name} database`));
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores
      Object.entries(dbConfig.stores).forEach(([storeName, keyPath]) => {
        if (!db.objectStoreNames.contains(storeName)) {
          const keyPathString = keyPath as string;
          const storeOptions: IDBObjectStoreParameters = 
            keyPathString.includes(',')
              ? { keyPath: keyPathString.split(',')[0], autoIncrement: true }
              : { keyPath, autoIncrement: false };
          
          const store = db.createObjectStore(storeName, storeOptions);
          
          // Add indices for additional fields if keyPath contains multiple fields
          if (keyPathString.includes(',')) {
            const indices = keyPathString.split(',').slice(1);
            indices.forEach(index => {
              store.createIndex(index.trim(), index.trim(), { unique: false });
            });
          }
        }
      });
    };
  });
};

// Generic function to store data
export const storeData = async <T extends object>(
  dbConfig: DBConfig,
  storeName: string,
  data: T
): Promise<IDBValidKey> => {
  const db = await openDatabase(dbConfig);
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    
    request.onerror = () => {
      reject(new Error(`Failed to store data in ${storeName}`));
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Generic function to retrieve data
export const getData = async <T>(
  dbConfig: DBConfig,
  storeName: string,
  key: IDBValidKey
): Promise<T | null> => {
  const db = await openDatabase(dbConfig);
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);
    
    request.onerror = () => {
      reject(new Error(`Failed to retrieve data from ${storeName}`));
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result || null);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Function to get all data from a store
export const getAllData = async <T>(
  dbConfig: DBConfig,
  storeName: string
): Promise<T[]> => {
  const db = await openDatabase(dbConfig);
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = () => {
      reject(new Error(`Failed to retrieve all data from ${storeName}`));
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result || []);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Function to delete data
export const deleteData = async (
  dbConfig: DBConfig,
  storeName: string,
  key: IDBValidKey
): Promise<void> => {
  const db = await openDatabase(dbConfig);
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);
    
    request.onerror = () => {
      reject(new Error(`Failed to delete data from ${storeName}`));
    };
    
    request.onsuccess = () => {
      resolve();
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Function to clear all data from a store
export const clearStore = async (
  dbConfig: DBConfig,
  storeName: string
): Promise<void> => {
  const db = await openDatabase(dbConfig);
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    
    request.onerror = () => {
      reject(new Error(`Failed to clear data from ${storeName}`));
    };
    
    request.onsuccess = () => {
      resolve();
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Store pending update for background sync
export const storePendingUpdate = async (
  type: 'knowledge' | 'workflow' | 'community',
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
  }
): Promise<void> => {
  const dbConfig = type === 'knowledge' ? KNOWLEDGE_DB : type === 'workflow' ? WORKFLOW_DB : COMMUNITY_DB;
  const pendingUpdate: PendingUpdate = {
    ...request,
    timestamp: Date.now(),
    body: request.body ? JSON.stringify(request.body) : undefined,
    attempts: 0
  };
  
  try {
    await storeData(dbConfig, 'pendingUpdates', pendingUpdate);
    
    // Register for background sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await (registration as SyncRegistration).sync.register(
        type === 'knowledge' ? SYNC_TAGS.KNOWLEDGE : type === 'workflow' ? SYNC_TAGS.WORKFLOW : SYNC_TAGS.COMMUNITY
      );
    }
  } catch (error) {
    console.error(`Failed to store pending ${type} update:`, error);
    throw error;
  }
};

// Knowledge base specific functions
export const knowledgeStorage = {
  storeArticle: <T extends { id: string | number }>(article: T) => 
    storeData(KNOWLEDGE_DB, 'articles', article),
  
  getArticle: <T>(id: string | number) => 
    getData<T>(KNOWLEDGE_DB, 'articles', id),
  
  getAllArticles: <T>() => 
    getAllData<T>(KNOWLEDGE_DB, 'articles'),
  
  deleteArticle: (id: string | number) => 
    deleteData(KNOWLEDGE_DB, 'articles', id),
  
  storePendingUpdate: (request: Parameters<typeof storePendingUpdate>[1]) => 
    storePendingUpdate('knowledge', request),
    
  getPendingUpdates: () => 
    getAllData<PendingUpdate>(KNOWLEDGE_DB, 'pendingUpdates'),
    
  removePendingUpdate: (id: IDBValidKey) => 
    deleteData(KNOWLEDGE_DB, 'pendingUpdates', id)
};

// Workflow specific functions
export const workflowStorage = {
  storeWorkflow: <T extends { id: string | number }>(workflow: T) => 
    storeData(WORKFLOW_DB, 'workflows', workflow),
  
  getWorkflow: <T>(id: string | number) => 
    getData<T>(WORKFLOW_DB, 'workflows', id),
  
  getAllWorkflows: <T>() => 
    getAllData<T>(WORKFLOW_DB, 'workflows'),
  
  deleteWorkflow: (id: string | number) => 
    deleteData(WORKFLOW_DB, 'workflows', id),
  
  storePendingUpdate: (request: Parameters<typeof storePendingUpdate>[1]) => 
    storePendingUpdate('workflow', request),
    
  getPendingUpdates: () => 
    getAllData<PendingUpdate>(WORKFLOW_DB, 'pendingUpdates'),
    
  removePendingUpdate: (id: IDBValidKey) => 
    deleteData(WORKFLOW_DB, 'pendingUpdates', id)
};

// Community specific functions
export const communityStorage = {
  storePost: <T extends { id: string | number }>(post: T) => 
    storeData(COMMUNITY_DB, 'posts', post),
  
  getPost: <T>(id: string | number) => 
    getData<T>(COMMUNITY_DB, 'posts', id),
  
  getAllPosts: <T>() => 
    getAllData<T>(COMMUNITY_DB, 'posts'),
  
  deletePost: (id: string | number) => 
    deleteData(COMMUNITY_DB, 'posts', id),
  
  storeComment: <T extends { id: string | number; postId: string | number }>(comment: T) => 
    storeData(COMMUNITY_DB, 'comments', comment),
    
  getCommentsByPost: async <T>(postId: string | number): Promise<T[]> => {
    const db = await openDatabase(COMMUNITY_DB);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('comments', 'readonly');
      const store = transaction.objectStore('comments');
      const index = store.index('postId');
      const request = index.getAll(postId);
      
      request.onerror = () => {
        reject(new Error(`Failed to retrieve comments for post ${postId}`));
      };
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result || []);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  },
  
  storePendingUpdate: (request: Parameters<typeof storePendingUpdate>[1]) => 
    storePendingUpdate('community', request),
    
  getPendingUpdates: () => 
    getAllData<PendingUpdate>(COMMUNITY_DB, 'pendingUpdates'),
    
  removePendingUpdate: (id: IDBValidKey) => 
    deleteData(COMMUNITY_DB, 'pendingUpdates', id)
};

// Check if the application is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Register event listeners for online/offline status
export const initNetworkStatusListeners = (
  onOnline?: () => void,
  onOffline?: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log('Application is online');
    onOnline?.();
  };
  
  const handleOffline = () => {
    console.log('Application is offline');
    onOffline?.();
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Function to detect if there are pending changes to sync
export const hasPendingChanges = async (): Promise<boolean> => {
  try {
    const knowledgePending = await knowledgeStorage.getPendingUpdates();
    const workflowPending = await workflowStorage.getPendingUpdates();
    const communityPending = await communityStorage.getPendingUpdates();
    
    return knowledgePending.length > 0 || workflowPending.length > 0 || communityPending.length > 0;
  } catch (error) {
    console.error('Error checking for pending changes:', error);
    return false;
  }
};

// Function to get all pending updates across all modules
export const getAllPendingUpdates = async (): Promise<{
  knowledge: PendingUpdate[];
  workflow: PendingUpdate[];
  community: PendingUpdate[];
}> => {
  try {
    const knowledge = await knowledgeStorage.getPendingUpdates();
    const workflow = await workflowStorage.getPendingUpdates();
    const community = await communityStorage.getPendingUpdates();
    
    return {
      knowledge,
      workflow,
      community
    };
  } catch (error) {
    console.error('Error getting all pending updates:', error);
    return {
      knowledge: [],
      workflow: [],
      community: []
    };
  }
};
