
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-lg">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link 
        to="/"
        className="mt-8 px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
