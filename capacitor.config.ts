import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'pakdome',
  webDir: 'www',
  android: {
    includePlugins: [
       "@capacitor/status-bar",
        "@capacitor/haptics",
        "@capacitor/keyboard",
        "@capacitor/preferences",
        "@capawesome/capacitor-file-picker",
        "@capacitor/app",
        "@capacitor/splash-screen",
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: "#00000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
  },
    StatusBar: {
      style: 'DARK',
      overlaysWebView: false 
    }
  }
};

export default config;

