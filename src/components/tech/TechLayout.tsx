
import React from 'react';
import { Outlet } from 'react-router-dom';

export function TechLayout() {
  return (
    <div className="tech-layout flex">
      <div className="tech-sidebar w-64 bg-green-50 min-h-screen p-4">
        {/* Tech Sidebar Content */}
        <h2 className="font-bold text-xl mb-4">Technician Portal</h2>
        <nav className="space-y-2">
          <a href="/tech" className="block p-2 hover:bg-green-100 rounded">Dashboard</a>
          <a href="/tech/profile" className="block p-2 hover:bg-green-100 rounded">Profile</a>
          <a href="/tech/settings" className="block p-2 hover:bg-green-100 rounded">Settings</a>
        </nav>
      </div>
      <div className="tech-content flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
