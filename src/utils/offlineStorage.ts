
/**
 * Utility functions for managing offline data storage and synchronization
 */

// Type definition for pending updates
export interface PendingUpdate {
  id?: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
  timestamp: number;
  attempts?: number;
}

// Check if there are pending changes that need to be synced
export async function hasPendingChanges(): Promise<boolean> {
  try {
    // In a real implementation, this would check local storage or IndexedDB
    // for pending changes that need to be synchronized with the server
    
    // For now, we'll return false to indicate no pending changes
    return false;
  } catch (error) {
    console.error('Error checking for pending changes:', error);
    return false;
  }
}

// Save data locally when offline
export async function saveOfflineData(key: string, data: any): Promise<void> {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify({
      data,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving offline data:', error);
  }
}

// Get offline data
export function getOfflineData<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(`offline_${key}`);
    if (!stored) return null;
    
    const { data } = JSON.parse(stored);
    return data as T;
  } catch (error) {
    console.error('Error retrieving offline data:', error);
    return null;
  }
}

// Sync offline data when back online
export async function syncOfflineData(): Promise<boolean> {
  // Implementation would depend on your application's specific needs
  // This is just a placeholder
  return true;
}

// Clear all offline data (e.g., after successful sync)
export function clearOfflineData(): void {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('offline_')) {
      keys.push(key);
    }
  }
  
  keys.forEach(key => localStorage.removeItem(key));
}

// Knowledge base specific storage utilities
export const knowledgeStorage = {
  async storeArticle(article: any): Promise<void> {
    await saveOfflineData(`knowledge_article_${article.id}`, article);
  },
  
  async getAllArticles<T>(): Promise<T[]> {
    const articles: T[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('offline_knowledge_article_')) {
        const article = getOfflineData<T>(key.replace('offline_', ''));
        if (article) articles.push(article);
      }
    }
    return articles;
  },
  
  async storePendingUpdate(update: PendingUpdate): Promise<void> {
    const pendingUpdates = await this.getPendingUpdates();
    pendingUpdates.push({
      ...update,
      id: `knowledge_${Date.now()}`,
      timestamp: Date.now()
    });
    localStorage.setItem('offline_knowledge_pending_updates', JSON.stringify(pendingUpdates));
  },
  
  async getPendingUpdates(): Promise<PendingUpdate[]> {
    try {
      const stored = localStorage.getItem('offline_knowledge_pending_updates');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting pending knowledge updates:', error);
      return [];
    }
  },
  
  async removePendingUpdate(id: string): Promise<void> {
    const pendingUpdates = await this.getPendingUpdates();
    const filteredUpdates = pendingUpdates.filter(update => update.id !== id);
    localStorage.setItem('offline_knowledge_pending_updates', JSON.stringify(filteredUpdates));
  }
};

// Community specific storage utilities
export const communityStorage = {
  async storePendingUpdate(update: PendingUpdate): Promise<void> {
    const pendingUpdates = await this.getPendingUpdates();
    pendingUpdates.push({
      ...update,
      id: `community_${Date.now()}`,
      timestamp: Date.now()
    });
    localStorage.setItem('offline_community_pending_updates', JSON.stringify(pendingUpdates));
  },
  
  async getPendingUpdates(): Promise<PendingUpdate[]> {
    try {
      const stored = localStorage.getItem('offline_community_pending_updates');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting pending community updates:', error);
      return [];
    }
  },
  
  async removePendingUpdate(id: string): Promise<void> {
    const pendingUpdates = await this.getPendingUpdates();
    const filteredUpdates = pendingUpdates.filter(update => update.id !== id);
    localStorage.setItem('offline_community_pending_updates', JSON.stringify(filteredUpdates));
  }
};

// Function to get all pending updates from all storage types
export async function getAllPendingUpdates(): Promise<{
  knowledge: PendingUpdate[];
  workflow: PendingUpdate[];
  community: PendingUpdate[];
}> {
  return {
    knowledge: await knowledgeStorage.getPendingUpdates(),
    workflow: [], // Placeholder for workflow storage
    community: await communityStorage.getPendingUpdates()
  };
}
