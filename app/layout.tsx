import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/theme-context";
import { VolumeProvider } from "./contexts/volume-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "batOS - Batcomputer Operating System",
  description: "A modern web-based desktop environment inspired by the Batcomputer, built with Next.js, TypeScript, and Tailwind CSS. Experience the Dark Knight's operating system with draggable windows, interactive widgets, and Batman-themed applications.",
  keywords: [
    "batman",
    "batcomputer",
    "desktop environment",
    "operating system",
    "next.js",
    "typescript",
    "tailwind css",
    "web desktop",
    "batman theme",
    "dark knight"
  ],
  authors: [{ name: "BATOS Team" }],
  creator: "BATOS Team",
  publisher: "BATOS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://batos.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BATOS - Batcomputer Operating System",
    description: "A modern web-based desktop environment inspired by the Batcomputer. Experience the Dark Knight's operating system with draggable windows, interactive widgets, and Batman-themed applications.",
    url: 'https://batos.dev',
    siteName: 'BATOS',
    images: [
      {
        url: '/batman-logo.png',
        width: 1200,
        height: 630,
        alt: 'BATOS - Batcomputer Operating System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BATOS - Batcomputer Operating System",
    description: "A modern web-based desktop environment inspired by the Batcomputer. Experience the Dark Knight's operating system.",
    images: ['/batman-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/batman-logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/batman-logo.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#1e40af',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <VolumeProvider>
            {children}
          </VolumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
