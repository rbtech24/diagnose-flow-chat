
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackupManager } from '@/components/data/BackupManager';
import { DataRetentionPolicies } from '@/components/data/DataRetentionPolicies';
import { DatabaseOptimization } from '@/components/data/DatabaseOptimization';
import { Database, Archive, Zap } from 'lucide-react';

export default function DataManagement() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Database className="h-8 w-8 mr-3 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Data Management</h1>
          <p className="text-muted-foreground">Backup, retention, and optimization tools</p>
        </div>
      </div>

      <Tabs defaultValue="backup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Backup Management
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Retention
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Database Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backup">
          <BackupManager />
        </TabsContent>

        <TabsContent value="retention">
          <DataRetentionPolicies />
        </TabsContent>

        <TabsContent value="optimization">
          <DatabaseOptimization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
