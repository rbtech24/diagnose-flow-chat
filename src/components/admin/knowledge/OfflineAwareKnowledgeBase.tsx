import React, { useState, useEffect } from "react";
import { KnowledgeArticle } from "@/types/knowledge";
import { useKnowledgeSync } from "@/hooks/useKnowledgeSync";
import { SyncStatusIndicator } from "@/components/system/SyncStatusIndicator";
import { ConflictResolutionDialog } from "./ConflictResolutionDialog";
import { knowledgeStorage } from "@/utils/offlineStorage";
import { Button } from "@/components/ui/button";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { Loader2, RefreshCw } from "lucide-react";
import { SyncStatusBadge } from "@/components/system/SyncStatusBadge";

interface OfflineAwareKnowledgeBaseProps {
  children: React.ReactNode;
}

export function OfflineAwareKnowledgeBase({ children }: OfflineAwareKnowledgeBaseProps) {
  const { isOffline } = useOfflineStatus();
  const { 
    syncStatus, 
    pendingChanges, 
    processedChanges, 
    conflictedItems,
    resolveConflict,
    syncOfflineChanges
  } = useKnowledgeSync();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConflict, setSelectedConflict] = useState<KnowledgeArticle | null>(null);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  
  useEffect(() => {
    // Simulate initial data loading
    const loadInitialData = async () => {
      setIsLoading(true);
      
      try {
        // First try to load from local storage
        const localArticles = await knowledgeStorage.getAllArticles<KnowledgeArticle>();
        
        // If we're online and don't have local data, fetch from server
        if (!isOffline && localArticles.length === 0) {
          // Simulate fetching from server
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would fetch from the server here
          // const { data } = await supabase.from('knowledge_articles').select('*');
          
          // For now, we'll just use an empty array
          // await Promise.all(data.map(article => knowledgeStorage.storeArticle(article)));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [isOffline]);
  
  // Handle conflict resolution
  const handleResolveConflict = async (
    article: KnowledgeArticle, 
    resolution: 'local' | 'remote' | 'merge'
  ) => {
    const success = await resolveConflict(article, resolution);
    return success;
  };
  
  // Show conflict dialog when there are conflicts
  useEffect(() => {
    if (conflictedItems.length > 0 && !selectedConflict) {
      setSelectedConflict(conflictedItems[0]);
      setShowConflictDialog(true);
    } else if (conflictedItems.length === 0) {
      setSelectedConflict(null);
      setShowConflictDialog(false);
    }
  }, [conflictedItems]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="text-lg">Loading knowledge base...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <SyncStatusIndicator 
        syncItems={pendingChanges} 
        processedItems={processedChanges} 
        showDetails={true} 
      />
      
      {pendingChanges > 0 && syncStatus !== 'syncing' && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={syncOfflineChanges}
            className="mb-2 gap-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Sync {pendingChanges} Changes</span>
            <SyncStatusBadge 
              syncItems={pendingChanges} 
              syncType="knowledge"
              variant="icon-only" 
              className="h-5 w-5 ml-1" 
            />
          </Button>
        </div>
      )}
      
      {/* Main content */}
      {children}
      
      {/* Conflict resolution dialog */}
      <ConflictResolutionDialog 
        article={selectedConflict}
        isOpen={showConflictDialog}
        onClose={() => {
          const nextConflict = conflictedItems.find(item => item.id !== selectedConflict?.id);
          if (nextConflict) {
            setSelectedConflict(nextConflict);
          } else {
            setShowConflictDialog(false);
            setSelectedConflict(null);
          }
        }}
        onResolve={handleResolveConflict}
      />
    </div>
  );
}
