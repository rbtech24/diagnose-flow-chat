
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface APIConfig {
  enabled: boolean;
  apiKey: string;
  apiSecret?: string;
  region?: string;
  additionalSettings?: Record<string, string>;
}

export interface APIConfigurations {
  stripe: APIConfig;
  helcim: APIConfig;
  twilio: APIConfig;
  sendgrid: APIConfig;
  supabase: APIConfig;
  openai: APIConfig;
  claude: APIConfig;
  grox: APIConfig;
}

interface APIConfigState {
  configs: APIConfigurations;
  updateConfig: (service: keyof APIConfigurations, config: Partial<APIConfig>) => void;
  toggleService: (service: keyof APIConfigurations) => void;
  updateNestedSetting: (
    service: keyof APIConfigurations,
    settingType: 'additionalSettings',
    key: string,
    value: string
  ) => void;
}

export const useAPIConfigStore = create<APIConfigState>()(
  persist(
    (set) => ({
      configs: {
        stripe: { enabled: false, apiKey: '', apiSecret: '' },
        helcim: { enabled: false, apiKey: '', apiSecret: '' },
        twilio: { enabled: false, apiKey: '', apiSecret: '', additionalSettings: { accountSid: '' }},
        sendgrid: { enabled: false, apiKey: '' },
        supabase: { enabled: true, apiKey: '***************', apiSecret: '***************' },
        openai: { enabled: false, apiKey: '', additionalSettings: { organization: '' } },
        claude: { enabled: false, apiKey: '' },
        grox: { enabled: false, apiKey: '' }
      },
      
      updateConfig: (service, config) => 
        set((state) => ({
          configs: {
            ...state.configs,
            [service]: {
              ...state.configs[service],
              ...config
            }
          }
        })),
      
      toggleService: (service) => 
        set((state) => ({
          configs: {
            ...state.configs,
            [service]: {
              ...state.configs[service],
              enabled: !state.configs[service].enabled
            }
          }
        })),
      
      updateNestedSetting: (service, settingType, key, value) =>
        set((state) => ({
          configs: {
            ...state.configs,
            [service]: {
              ...state.configs[service],
              [settingType]: {
                ...state.configs[service][settingType],
                [key]: value
              }
            }
          }
        }))
    }),
    {
      name: 'api-configs-storage',
    }
  )
);
