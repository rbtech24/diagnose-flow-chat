
import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  category: string;
  status: string;
  description?: string;
  lastSync?: string;
  provider?: string;
  config?: Record<string, any>;
  credentials?: Record<string, any>;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
  last_sync?: string; // Including both lastSync and last_sync to handle database naming
}

interface Webhook {
  id: string;
  name: string;
  description?: string;
  url: string;
  status: string;
  events: string[];
  integration_id: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiIntegrationsState {
  availableIntegrations: Integration[];
  connectedIntegrations: Integration[];
  webhooks: Webhook[];
  isLoading: {
    available: boolean;
    connected: boolean;
    webhooks: boolean;
  };
  activeTab: string;
  fetchAvailableIntegrations: () => Promise<void>;
  fetchConnectedIntegrations: () => Promise<void>;
  fetchWebhooks: () => Promise<void>;
  connectIntegration: (integration: Integration, config?: Record<string, any>, credentials?: Record<string, any>) => Promise<boolean>;
  disconnectIntegration: (integrationId: string) => Promise<boolean>;
  createWebhook: (webhook: Partial<Webhook>) => Promise<boolean>;
  setActiveTab: (tab: string) => void;
}

export const useApiIntegrationsStore = create<ApiIntegrationsState>((set, get) => ({
  availableIntegrations: [],
  connectedIntegrations: [],
  webhooks: [],
  isLoading: {
    available: false,
    connected: false,
    webhooks: false,
  },
  activeTab: 'available',

  setActiveTab: (tab) => {
    set({ activeTab: tab });
    
    // Load data for the selected tab if not loaded yet
    if (tab === 'available' && get().availableIntegrations.length === 0) {
      get().fetchAvailableIntegrations();
    } else if (tab === 'connected' && get().connectedIntegrations.length === 0) {
      get().fetchConnectedIntegrations();
    } else if (tab === 'webhooks' && get().webhooks.length === 0) {
      get().fetchWebhooks();
    }
  },

  fetchAvailableIntegrations: async () => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, available: true }
      }));

      const { data, error } = await supabase.functions.invoke('manage-integrations/available', {
        method: 'GET',
        body: {},
      });

      if (error) {
        console.error('Error fetching available integrations:', error);
        toast.error('Failed to load available integrations');
        return;
      }

      // Mark integrations that are already connected
      const connectedIds = get().connectedIntegrations.map(i => i.provider);
      const availableWithStatus = data.data.map((integration: Integration) => ({
        ...integration,
        status: connectedIds.includes(integration.id) ? 'Connected' : 'Not Connected'
      }));

      set({
        availableIntegrations: availableWithStatus,
        isLoading: { ...get().isLoading, available: false }
      });
    } catch (error) {
      console.error('Error in fetchAvailableIntegrations:', error);
      toast.error('Failed to load available integrations');
      set((state) => ({
        isLoading: { ...state.isLoading, available: false }
      }));
    }
  },

  fetchConnectedIntegrations: async () => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, connected: true }
      }));

      const { data, error } = await supabase.functions.invoke('manage-integrations/connected', {
        method: 'GET',
        body: {},
      });

      if (error) {
        console.error('Error fetching connected integrations:', error);
        toast.error('Failed to load connected integrations');
        return;
      }

      // Transform data to ensure consistent property naming
      const transformedData = (data.data || []).map((item: any) => ({
        ...item,
        lastSync: item.last_sync // Ensure lastSync property exists for components that use it
      }));

      set({
        connectedIntegrations: transformedData,
        isLoading: { ...get().isLoading, connected: false }
      });

      // Update available integrations status if they're loaded
      if (get().availableIntegrations.length > 0) {
        const connectedIds = transformedData.map((i: Integration) => i.provider) || [];
        const updatedAvailable = get().availableIntegrations.map(integration => ({
          ...integration,
          status: connectedIds.includes(integration.id) ? 'Connected' : 'Not Connected'
        }));
        
        set({ availableIntegrations: updatedAvailable });
      }
    } catch (error) {
      console.error('Error in fetchConnectedIntegrations:', error);
      toast.error('Failed to load connected integrations');
      set((state) => ({
        isLoading: { ...state.isLoading, connected: false }
      }));
    }
  },

  fetchWebhooks: async () => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, webhooks: true }
      }));

      const { data, error } = await supabase.functions.invoke('manage-integrations/webhooks', {
        method: 'GET',
        body: {},
      });

      if (error) {
        console.error('Error fetching webhooks:', error);
        toast.error('Failed to load webhooks');
        return;
      }

      set({
        webhooks: data.data || [],
        isLoading: { ...get().isLoading, webhooks: false }
      });
    } catch (error) {
      console.error('Error in fetchWebhooks:', error);
      toast.error('Failed to load webhooks');
      set((state) => ({
        isLoading: { ...state.isLoading, webhooks: false }
      }));
    }
  },

  connectIntegration: async (integration, config = {}, credentials = {}) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-integrations/connect', {
        method: 'POST',
        body: {
          provider: integration.id,
          name: integration.name,
          description: integration.description,
          category: integration.category,
          config,
          credentials
        },
      });

      if (error) {
        console.error('Error connecting integration:', error);
        toast.error(`Failed to connect ${integration.name}`);
        return false;
      }

      // Refresh connected integrations
      await get().fetchConnectedIntegrations();

      toast.success(`${integration.name} has been connected successfully`);

      return true;
    } catch (error) {
      console.error('Error in connectIntegration:', error);
      toast.error(`Failed to connect ${integration.name}`);
      return false;
    }
  },

  disconnectIntegration: async (integrationId) => {
    try {
      const integration = get().connectedIntegrations.find(i => i.id === integrationId);
      
      if (!integration) {
        toast.error('Integration not found');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('manage-integrations/disconnect', {
        method: 'POST',
        body: { integrationId },
      });

      if (error) {
        console.error('Error disconnecting integration:', error);
        toast.error(`Failed to disconnect ${integration.name}`);
        return false;
      }

      // Refresh connected integrations
      await get().fetchConnectedIntegrations();

      toast.success(`${integration.name} has been disconnected`);

      return true;
    } catch (error) {
      console.error('Error in disconnectIntegration:', error);
      toast.error('Failed to disconnect integration');
      return false;
    }
  },

  createWebhook: async (webhook) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-integrations/webhook', {
        method: 'POST',
        body: webhook,
      });

      if (error) {
        console.error('Error creating webhook:', error);
        toast.error('Failed to create webhook');
        return false;
      }

      // Refresh webhooks
      await get().fetchWebhooks();

      toast.success('Webhook created successfully');

      return true;
    } catch (error) {
      console.error('Error in createWebhook:', error);
      toast.error('Failed to create webhook');
      return false;
    }
  }
}));
