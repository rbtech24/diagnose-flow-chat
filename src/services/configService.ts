
interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    baseUrl: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    projectId: string;
  };
  features: {
    emailEnabled: boolean;
    fileUploadEnabled: boolean;
    realtimeEnabled: boolean;
    analyticsEnabled: boolean;
    debugMode: boolean;
  };
  limits: {
    maxFileSize: number;
    maxFilesPerUpload: number;
    apiRateLimit: number;
    maxTicketsPerPage: number;
  };
  ui: {
    defaultTheme: 'light' | 'dark' | 'system';
    showBetaFeatures: boolean;
    enableTooltips: boolean;
  };
}

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    // Get base URL - in production use the actual domain
    const getBaseUrl = (): string => {
      if (typeof window !== 'undefined') {
        return window.location.origin;
      }
      return 'https://jukatimjnqhhlxkrxsak.supabase.co';
    };

    // Determine environment
    const getEnvironment = (): 'development' | 'staging' | 'production' => {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
      } else if (hostname.includes('staging') || hostname.includes('lovable.app')) {
        return 'staging';
      } else {
        return 'production';
      }
    };

    const environment = getEnvironment();

    return {
      app: {
        name: 'Appliance Repair Management',
        version: '1.0.0',
        environment,
        baseUrl: getBaseUrl()
      },
      supabase: {
        url: 'https://jukatimjnqhhlxkrxsak.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2F0aW1qbnFoaGx4a3J4c2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTg3MjYsImV4cCI6MjA1NDk3NDcyNn0.cbWwrd2QIEkb25-8tKpcqRhYai1q6bMcxd2dkC_qssE',
        projectId: 'jukatimjnqhhlxkrxsak'
      },
      features: {
        emailEnabled: true,
        fileUploadEnabled: true,
        realtimeEnabled: environment !== 'development', // Disable in dev to reduce noise
        analyticsEnabled: environment === 'production',
        debugMode: environment === 'development'
      },
      limits: {
        maxFileSize: 50 * 1024 * 1024, // 50MB
        maxFilesPerUpload: 10,
        apiRateLimit: environment === 'production' ? 100 : 1000, // requests per minute
        maxTicketsPerPage: 50
      },
      ui: {
        defaultTheme: 'system',
        showBetaFeatures: environment !== 'production',
        enableTooltips: true
      }
    };
  }

  /**
   * Get the full configuration
   */
  getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Get a specific config section
   */
  getAppConfig() {
    return { ...this.config.app };
  }

  getSupabaseConfig() {
    return { ...this.config.supabase };
  }

  getFeaturesConfig() {
    return { ...this.config.features };
  }

  getLimitsConfig() {
    return { ...this.config.limits };
  }

  getUIConfig() {
    return { ...this.config.ui };
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Get environment-specific values
   */
  isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  isStaging(): boolean {
    return this.config.app.environment === 'staging';
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  /**
   * Get API endpoints
   */
  getApiEndpoints() {
    const baseUrl = this.config.supabase.url;
    
    return {
      rest: `${baseUrl}/rest/v1`,
      auth: `${baseUrl}/auth/v1`,
      storage: `${baseUrl}/storage/v1`,
      functions: `${baseUrl}/functions/v1`,
      realtime: baseUrl.replace('https://', 'wss://') + '/realtime/v1'
    };
  }

  /**
   * Get file upload configuration
   */
  getFileUploadConfig() {
    return {
      maxSize: this.config.limits.maxFileSize,
      maxFiles: this.config.limits.maxFilesPerUpload,
      allowedTypes: this.getAllowedFileTypes(),
      bucket: 'uploads'
    };
  }

  /**
   * Get allowed file types based on environment
   */
  private getAllowedFileTypes(): string[] {
    const baseTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];

    // Add more types in development
    if (this.isDevelopment()) {
      return [
        ...baseTypes,
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/json'
      ];
    }

    return baseTypes;
  }

  /**
   * Get security configuration
   */
  getSecurityConfig() {
    return {
      enableCSRF: this.isProduction(),
      enableRateLimit: true,
      sessionTimeout: this.isProduction() ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 1 day prod, 7 days dev
      maxLoginAttempts: 5,
      passwordMinLength: 8
    };
  }

  /**
   * Log current configuration (for debugging)
   */
  logConfig(): void {
    if (this.config.features.debugMode) {
      console.log('App Configuration:', {
        environment: this.config.app.environment,
        features: this.config.features,
        limits: this.config.limits,
        endpoints: this.getApiEndpoints()
      });
    }
  }

  /**
   * Validate configuration
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate Supabase config
    if (!this.config.supabase.url) {
      errors.push('Supabase URL is required');
    }

    if (!this.config.supabase.anonKey) {
      errors.push('Supabase anon key is required');
    }

    // Validate limits
    if (this.config.limits.maxFileSize <= 0) {
      errors.push('Max file size must be greater than 0');
    }

    if (this.config.limits.apiRateLimit <= 0) {
      errors.push('API rate limit must be greater than 0');
    }

    // Validate URLs
    try {
      new URL(this.config.supabase.url);
    } catch {
      errors.push('Invalid Supabase URL format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const configService = new ConfigService();

// Initialize and validate config on startup
const validation = configService.validateConfig();
if (!validation.isValid) {
  console.error('Configuration validation failed:', validation.errors);
}

// Log config in development
configService.logConfig();

export default configService;
