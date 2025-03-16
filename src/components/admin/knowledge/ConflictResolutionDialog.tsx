
import React from 'react';
import { KnowledgeArticle } from '@/types/knowledge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConflictResolutionDialogProps {
  article: KnowledgeArticle | null;
  serverVersion?: KnowledgeArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (article: KnowledgeArticle, resolution: 'local' | 'remote' | 'merge') => Promise<boolean>;
}

export function ConflictResolutionDialog({
  article,
  serverVersion,
  isOpen,
  onClose,
  onResolve
}: ConflictResolutionDialogProps) {
  if (!article) return null;
  
  // If we don't have a server version, use a mock one for demo
  const remoteArticle = serverVersion || {
    ...article,
    content: `${article.content}\n\nThis is the server version with some different content.`,
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  };
  
  const handleResolve = async (resolution: 'local' | 'remote' | 'merge') => {
    const success = await onResolve(
      resolution === 'remote' ? remoteArticle : article, 
      resolution
    );
    if (success) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Resolve Sync Conflict</DialogTitle>
          <DialogDescription>
            This article has been modified both locally and on the server. 
            Please choose which version to keep or merge the changes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 h-full">
          <Tabs defaultValue="comparison" className="flex-grow flex flex-col">
            <TabsList>
              <TabsTrigger value="comparison">Side by Side</TabsTrigger>
              <TabsTrigger value="local">Your Version</TabsTrigger>
              <TabsTrigger value="remote">Server Version</TabsTrigger>
            </TabsList>
            
            <TabsContent value="comparison" className="flex-grow">
              <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)]">
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Your Version</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Last updated: {new Date(article.updatedAt).toLocaleString()}
                  </p>
                  <ScrollArea className="h-[calc(100%-3rem)]">
                    <div className="prose prose-sm max-w-none">
                      <h4>{article.title}</h4>
                      <p>{article.content}</p>
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Server Version</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Last updated: {new Date(remoteArticle.updatedAt).toLocaleString()}
                  </p>
                  <ScrollArea className="h-[calc(100%-3rem)]">
                    <div className="prose prose-sm max-w-none">
                      <h4>{remoteArticle.title}</h4>
                      <p>{remoteArticle.content}</p>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="local" className="h-[calc(100%-2rem)]">
              <ScrollArea className="h-full border rounded-md p-4">
                <div className="prose max-w-none">
                  <h2>{article.title}</h2>
                  <p>{article.content}</p>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="remote" className="h-[calc(100%-2rem)]">
              <ScrollArea className="h-full border rounded-md p-4">
                <div className="prose max-w-none">
                  <h2>{remoteArticle.title}</h2>
                  <p>{remoteArticle.content}</p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleResolve('remote')}>
            Use Server Version
          </Button>
          <Button variant="outline" onClick={() => handleResolve('merge')}>
            Merge Changes
          </Button>
          <Button onClick={() => handleResolve('local')}>
            Use My Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
