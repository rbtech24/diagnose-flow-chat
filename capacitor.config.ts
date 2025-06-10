
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.937dd10ba54e4d65b21eed600d33e344',
  appName: 'DiagnoseFlow Tech',
  webDir: 'dist',
  server: {
    url: 'https://937dd10b-a54e-4d65-b21e-ed600d33e344.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;
