
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DiagnosticSelector } from '@/components/diagnostics/DiagnosticSelector';
import { DiagnosticSteps } from '@/components/diagnostics/DiagnosticSteps';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { SyncStatusBadge } from '@/components/system/SyncStatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const diagCategories = [
  { id: 'refr', name: 'Refrigeration' },
  { id: 'dish', name: 'Dishwashers' },
  { id: 'laun', name: 'Laundry' },
  { id: 'rang', name: 'Ranges & Ovens' },
  { id: 'hvac', name: 'HVAC' },
];

const diagnostics = [
  { id: 'diag1', name: 'No Cooling Diagnostic', categoryId: 'refr', complexity: 'medium' },
  { id: 'diag2', name: 'Not Washing Diagnostic', categoryId: 'dish', complexity: 'easy' },
  { id: 'diag3', name: 'No Spin Diagnostic', categoryId: 'laun', complexity: 'medium' },
  { id: 'diag4', name: 'No Heat Diagnostic', categoryId: 'rang', complexity: 'hard' },
  { id: 'diag5', name: 'No Airflow Diagnostic', categoryId: 'hvac', complexity: 'medium' },
];

export default function DiagnosticsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<string | null>(null);
  const { isOffline } = useOfflineStatus();

  // Filter diagnostics based on selected category
  const filteredDiagnostics = selectedCategory 
    ? diagnostics.filter(d => d.categoryId === selectedCategory)
    : diagnostics;
    
  // Find the complete diagnostic object based on selected ID
  const currentDiagnostic = diagnostics.find(d => d.id === selectedDiagnostic);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Diagnostic Procedures</h1>
          <p className="text-gray-500">Step-by-step troubleshooting guides</p>
        </div>
        <SyncStatusBadge isOnline={!isOffline} />
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Diagnostics</TabsTrigger>
          <TabsTrigger value="recent">Recent Diagnostics</TabsTrigger>
          <TabsTrigger value="favorites">Favorite Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {!selectedDiagnostic ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Select a diagnostic category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${!selectedCategory ? 'bg-blue-50 text-blue-700' : ''}`}
                      >
                        All Categories
                      </button>
                      
                      {diagCategories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${selectedCategory === category.id ? 'bg-blue-50 text-blue-700' : ''}`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <DiagnosticSelector 
                  diagnostics={filteredDiagnostics}
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedDiagnostic}
                />
              </div>
            </div>
          ) : (
            <DiagnosticSteps 
              diagnostic={currentDiagnostic}
              onBack={() => setSelectedDiagnostic(null)}
            />
          )}
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                <p>No recent diagnostics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                <p>No favorite diagnostics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
