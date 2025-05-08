
import React from 'react';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="admin-layout flex">
      <div className="admin-sidebar w-64 bg-gray-100 min-h-screen p-4">
        {/* Admin Sidebar Content */}
        <h2 className="font-bold text-xl mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block p-2 hover:bg-gray-200 rounded">Dashboard</a>
          <a href="/admin/users" className="block p-2 hover:bg-gray-200 rounded">Users</a>
          <a href="/admin/companies" className="block p-2 hover:bg-gray-200 rounded">Companies</a>
          <a href="/admin/profile" className="block p-2 hover:bg-gray-200 rounded">Profile</a>
          <a href="/admin/system-messages" className="block p-2 hover:bg-gray-200 rounded">System Messages</a>
          <a href="/admin/support" className="block p-2 hover:bg-gray-200 rounded">Support</a>
          <a href="/admin/settings" className="block p-2 hover:bg-gray-200 rounded">Settings</a>
        </nav>
      </div>
      <div className="admin-content flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
