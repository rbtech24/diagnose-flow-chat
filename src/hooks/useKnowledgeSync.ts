
import { useState, useEffect } from 'react';
import { KnowledgeArticle } from '@/types/knowledge';
import { knowledgeStorage } from '@/utils/offlineStorage';
import { useOfflineStatus } from './useOfflineStatus';
import { supabase } from '@/integrations/supabase/client';

type SyncStatus = 'idle' | 'syncing' | 'completed' | 'error';

export function useKnowledgeSync() {
  const { isOffline, reconnecting } = useOfflineStatus();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingChanges, setPendingChanges] = useState<number>(0);
  const [processedChanges, setProcessedChanges] = useState<number>(0);
  const [conflictedItems, setConflictedItems] = useState<KnowledgeArticle[]>([]);

  // Fetch pending changes count
  useEffect(() => {
    async function getPendingCount() {
      try {
        const pendingUpdates = await knowledgeStorage.getPendingUpdates();
        setPendingChanges(pendingUpdates.length);
      } catch (error) {
        console.error('Error getting pending updates:', error);
      }
    }

    getPendingCount();
    
    // Set up interval to check for pending changes
    const interval = setInterval(getPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Start sync when reconnecting
  useEffect(() => {
    if (!isOffline && reconnecting && pendingChanges > 0) {
      syncOfflineChanges();
    }
  }, [isOffline, reconnecting, pendingChanges]);

  // Function to queue an edit made offline
  const queueOfflineChange = async (
    article: KnowledgeArticle, 
    action: 'create' | 'update' | 'delete'
  ) => {
    try {
      // Store the article in local offline storage
      if (action !== 'delete') {
        await knowledgeStorage.storeArticle(article);
      }
      
      // Queue the change for later sync
      const endpoint = `/api/knowledge/${action === 'create' ? '' : article.id}`;
      const method = action === 'create' 
        ? 'POST' 
        : action === 'update' ? 'PUT' : 'DELETE';
      
      await knowledgeStorage.storePendingUpdate({
        url: endpoint,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: action !== 'delete' ? JSON.stringify(article) : undefined,
        timestamp: Date.now()
      });
      
      // Update pending count
      setPendingChanges(prev => prev + 1);
      
      return true;
    } catch (error) {
      console.error(`Error queueing offline ${action}:`, error);
      return false;
    }
  };
  
  // Function to handle article conflicts
  const resolveConflict = async (
    article: KnowledgeArticle,
    resolution: 'local' | 'remote' | 'merge'
  ) => {
    try {
      if (resolution === 'local') {
        // Use the local version and push to server
        await syncArticleToServer(article);
      } else if (resolution === 'remote') {
        // Use the server version (already there, just update local copy)
        await knowledgeStorage.storeArticle(article);
      } else if (resolution === 'merge') {
        // Custom merge logic would go here
        // For now, we'll just do a simple merge by updating timestamps
        const mergedArticle = {
          ...article,
          updatedAt: new Date().toISOString()
        };
        await syncArticleToServer(mergedArticle);
      }
      
      // Remove from conflicts list
      setConflictedItems(prev => prev.filter(item => item.id !== article.id));
      
      return true;
    } catch (error) {
      console.error('Error resolving conflict:', error);
      return false;
    }
  };
  
  // Synchronize an article to the server
  const syncArticleToServer = async (article: KnowledgeArticle) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // In a real implementation, this would use proper Supabase calls
      // For now, we'll just simulate the operation
      console.log('Syncing article to server:', article);
      
      // This is where you'd add the actual Supabase upsert code
      // const { data, error } = await supabase
      //   .from('knowledge_articles')
      //   .upsert(article);
      
      return true;
    } catch (error) {
      console.error('Error syncing to server:', error);
      return false;
    }
  };
  
  // Function to sync all offline changes
  const syncOfflineChanges = async () => {
    if (syncStatus === 'syncing') return;
    
    try {
      setSyncStatus('syncing');
      
      // Get all pending updates
      const pendingUpdates = await knowledgeStorage.getPendingUpdates();
      
      if (pendingUpdates.length === 0) {
        setSyncStatus('completed');
        return;
      }
      
      setProcessedChanges(0);
      setPendingChanges(pendingUpdates.length);
      
      const conflicts: KnowledgeArticle[] = [];
      
      // Process each update
      for (let i = 0; i < pendingUpdates.length; i++) {
        const update = pendingUpdates[i];
        
        try {
          // Check for conflicts (if it's an update)
          if (update.method === 'PUT' && update.body) {
            const article = JSON.parse(update.body) as KnowledgeArticle;
            
            // Simulate conflict detection - in a real app, you'd compare timestamps or versions
            const hasConflict = Math.random() < 0.2; // 20% chance of conflict for demo
            
            if (hasConflict) {
              conflicts.push(article);
              continue;
            }
          }
          
          // Simulate successful sync
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Remove from pending updates
          await knowledgeStorage.removePendingUpdate(update.id);
          
          setProcessedChanges(i + 1);
        } catch (error) {
          console.error('Error processing update:', error);
        }
      }
      
      // Update conflicts and status
      setConflictedItems(conflicts);
      setSyncStatus(conflicts.length > 0 ? 'error' : 'completed');
      
      // Get updated counts
      const remainingUpdates = await knowledgeStorage.getPendingUpdates();
      setPendingChanges(remainingUpdates.length);
      
    } catch (error) {
      console.error('Error syncing changes:', error);
      setSyncStatus('error');
    }
  };
  
  return {
    syncStatus,
    pendingChanges,
    processedChanges,
    conflictedItems,
    queueOfflineChange,
    resolveConflict,
    syncOfflineChanges
  };
}
