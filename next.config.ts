import type { NextConfig } from "next";

// `BUILD_TARGET=capacitor` produces a static export (`out/`) bundled into the
// Android app. The default build stays `standalone` for the server deployment.
const isCapacitor = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  output: isCapacitor ? "export" : "standalone",
  reactStrictMode: true,
  // Static export can't optimize images at request time.
  images: { unoptimized: true },
  // Cleaner static asset paths for the file:// WebView.
  ...(isCapacitor ? { trailingSlash: true } : {}),
  // Allow Server Actions to work through the preview proxy
  allowedDevOrigins: [
    "*.space-z.ai",
    "*.fcapp.run",
    "localhost",
    "127.0.0.1",
  ],
  // `headers()` is not supported under `output: 'export'` — omit it for the
  // Capacitor build (the remote server still applies these on the web build).
  ...(isCapacitor
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                { key: "X-DNS-Prefetch-Control", value: "on" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
