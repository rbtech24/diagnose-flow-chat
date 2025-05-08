
import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme: string;
  storageKey: string;
}

export function ThemeProvider({ children, defaultTheme, storageKey }: ThemeProviderProps) {
  // In a real app, this would manage theme state
  // For now, it's just a wrapper component to fix the build error
  return <>{children}</>;
}
