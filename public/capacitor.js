
// Capacitor plugins initialization
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

// Platform detection
export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

// Initialize app when running on mobile
if (isNative) {
  // Hide splash screen after app loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  });
}

// Export for use in the app
window.CapacitorPlatform = {
  isNative,
  platform
};
