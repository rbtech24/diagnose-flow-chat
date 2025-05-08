
import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-9xl font-bold text-gray-800">401</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">Unauthorized Access</h2>
      <p className="text-gray-500 mt-2 max-w-lg">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <div className="mt-8 flex space-x-4">
        <Link 
          to="/login"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </Link>
        <Link 
          to="/"
          className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
