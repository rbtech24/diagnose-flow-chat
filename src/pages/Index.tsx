
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Index() {
  // Redirect to sales page by default
  return <Navigate to="/sales" replace />;
}
