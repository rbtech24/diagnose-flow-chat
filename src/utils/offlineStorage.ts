
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

// ServiceWorker sync registration interface
interface SyncRegistration extends ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
  }
}

// Background sync tags
export const SYNC_TAGS = {
  KNOWLEDGE: 'sync-knowledge-updates',
  WORKFLOW: 'sync-workflow-updates'
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
          const storeOptions: IDBObjectStoreParameters = 
            typeof keyPath === 'string' && keyPath.includes(',')
              ? { keyPath: keyPath.split(',')[0], autoIncrement: true }
              : { keyPath, autoIncrement: false };
          
          const store = db.createObjectStore(storeName, storeOptions);
          
          // Add indices for additional fields if keyPath contains multiple fields
          if (typeof keyPath === 'string' && keyPath.includes(',')) {
            const indices = keyPath.split(',').slice(1);
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
  type: 'knowledge' | 'workflow',
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
  }
): Promise<void> => {
  const dbConfig = type === 'knowledge' ? KNOWLEDGE_DB : WORKFLOW_DB;
  
  try {
    await storeData(dbConfig, 'pendingUpdates', {
      ...request,
      timestamp: Date.now(),
      body: request.body ? JSON.stringify(request.body) : undefined
    });
    
    // Register for background sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await (registration as SyncRegistration).sync.register(
        type === 'knowledge' ? SYNC_TAGS.KNOWLEDGE : SYNC_TAGS.WORKFLOW
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
    storePendingUpdate('knowledge', request)
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
    storePendingUpdate('workflow', request)
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
