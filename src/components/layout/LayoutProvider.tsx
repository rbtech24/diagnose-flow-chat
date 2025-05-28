
import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { useLogger } from '@/hooks/useLogger';

interface LayoutState {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  headerHeight: number;
  footerHeight: number;
  contentPadding: number;
}

interface LayoutContextType {
  state: LayoutState;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setHeaderHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
  initialState?: Partial<LayoutState>;
}

export function LayoutProvider({ children, initialState }: LayoutProviderProps) {
  const logger = useLogger('LayoutProvider');
  
  const [state, setState] = useState<LayoutState>({
    sidebarCollapsed: false,
    sidebarOpen: false,
    headerHeight: 64,
    footerHeight: 0,
    contentPadding: 16,
    ...initialState
  });

  const toggleSidebar = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, sidebarCollapsed: !prev.sidebarCollapsed };
      logger.logUserAction('toggle_sidebar', { collapsed: newState.sidebarCollapsed });
      return newState;
    });
  }, [logger]);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setState(prev => ({ ...prev, sidebarCollapsed: collapsed }));
    logger.logUserAction('set_sidebar_collapsed', { collapsed });
  }, [logger]);

  const setSidebarOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, sidebarOpen: open }));
    logger.logUserAction('set_sidebar_open', { open });
  }, [logger]);

  const setHeaderHeight = useCallback((height: number) => {
    setState(prev => ({ ...prev, headerHeight: height }));
  }, []);

  const setFooterHeight = useCallback((height: number) => {
    setState(prev => ({ ...prev, footerHeight: height }));
  }, []);

  const contextValue: LayoutContextType = {
    state,
    toggleSidebar,
    setSidebarCollapsed,
    setSidebarOpen,
    setHeaderHeight,
    setFooterHeight
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
