
import React, { ReactNode } from 'react';

interface CompanyLayoutProps {
  children: ReactNode;
}

export function CompanyLayout({ children }: CompanyLayoutProps) {
  return (
    <div className="company-layout flex">
      <div className="company-sidebar w-64 bg-blue-50 min-h-screen p-4">
        {/* Company Sidebar Content */}
        <h2 className="font-bold text-xl mb-4">Company Dashboard</h2>
        <nav className="space-y-2">
          <a href="/company" className="block p-2 hover:bg-blue-100 rounded">Dashboard</a>
          <a href="/company/technicians" className="block p-2 hover:bg-blue-100 rounded">Technicians</a>
          <a href="/company/appointments" className="block p-2 hover:bg-blue-100 rounded">Appointments</a>
          <a href="/company/knowledge" className="block p-2 hover:bg-blue-100 rounded">Knowledge Base</a>
          <a href="/company/community" className="block p-2 hover:bg-blue-100 rounded">Community</a>
          <a href="/company/feature-requests" className="block p-2 hover:bg-blue-100 rounded">Feature Requests</a>
          <a href="/company/profile" className="block p-2 hover:bg-blue-100 rounded">Profile</a>
          <a href="/company/settings" className="block p-2 hover:bg-blue-100 rounded">Settings</a>
          <a href="/company/billing" className="block p-2 hover:bg-blue-100 rounded">Billing</a>
        </nav>
      </div>
      <div className="company-content flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
