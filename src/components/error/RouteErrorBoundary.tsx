
import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export function RouteErrorBoundary() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  console.error('Route error:', error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Page Error</h1>
        <p className="text-gray-600 mb-4">
          {error?.statusText || error?.message || 'An error occurred while loading this page.'}
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4 text-left bg-gray-50 p-3 rounded text-sm">
            <summary className="cursor-pointer font-semibold">Error Details</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error?.stack || JSON.stringify(error, null, 2)}</pre>
          </details>
        )}
        
        <div className="space-y-2">
          <Button onClick={() => navigate(-1)} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
