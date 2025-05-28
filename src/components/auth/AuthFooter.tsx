
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthFooterProps {
  linkText: string;
  linkHref: string;
  actionText: string;
}

export function AuthFooter({ linkText, linkHref, actionText }: AuthFooterProps) {
  return (
    <div className="text-center text-sm text-gray-500">
      {linkText}{' '}
      <Link to={linkHref} className="text-blue-600 hover:text-blue-800">
        {actionText}
      </Link>
    </div>
  );
}
