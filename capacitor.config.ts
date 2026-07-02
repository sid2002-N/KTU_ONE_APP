import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ktuone.app",
  appName: "KTU One",
  webDir: "out", // Next.js static export output dir (BUILD_TARGET=capacitor)
  server: {
    androidScheme: "https",
  },
  plugins: {
    // Route fetch()/XHR through the native HTTP layer so httpOnly auth cookies
    // flow cross-origin to the remote backend (the WebView origin is
    // https://localhost). This is what makes cookie-based login work on device.
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FCFBF8",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
