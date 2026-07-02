import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Caveat, Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "KTU One — Everything a KTU Student Needs.",
  description:
    "The ultimate academic companion for APJ Abdul Kalam Technological University students. SGPA/CGPA calculators, question papers, syllabus, notices, calendar — all in one premium app.",
  keywords: [
    "KTU",
    "KTU One",
    "APJ Abdul Kalam Technological University",
    "SGPA Calculator",
    "CGPA Calculator",
    "KTU Question Papers",
    "KTU Syllabus",
    "KTU Notices",
  ],
  authors: [{ name: "KTU One" }],
  applicationName: "KTU One",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KTU One",
  },
  openGraph: {
    title: "KTU One — Everything a KTU Student Needs.",
    description: "Premium academic companion for KTU students.",
    type: "website",
    siteName: "KTU One",
  },
  twitter: {
    card: "summary_large_image",
    title: "KTU One",
    description: "Premium academic companion for KTU students.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFBF8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1620" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${lora.variable} antialiased`}
      >
        {/* Ambient background blobs — fixed, behind everything */}
        <div className="ambient-blobs" aria-hidden="true">
          <div className="ambient-blob-3" />
        </div>
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
        <Toaster />
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}
