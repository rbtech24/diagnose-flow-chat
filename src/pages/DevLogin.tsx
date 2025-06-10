
import React from 'react';
import { DevAuthBypass } from '@/components/dev/DevAuthBypass';

export default function DevLogin() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Development Login</h1>
          <p className="text-gray-600 mt-2">Access different user dashboards for testing</p>
        </div>
        <DevAuthBypass />
      </div>
    </div>
  );
}
