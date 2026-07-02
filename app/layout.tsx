import React from "react";
import type { Metadata } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://simplelistr.com"),
  title: {
    default: "SimpleListr - Auto Listing Tool",
    template: "%s | SimpleListr",
  },
  description:
    "SimpleListr automatically researches, writes, and lists your eBay items at scale. AI-powered listing creation, image thumbnail generation, and Google Trends research — list infinitely, scale infinitely.",
  keywords: [
    "eBay listing tool",
    "automated eBay listings",
    "AI eBay seller",
    "eBay listing software",
    "eBay reseller tool",
    "bulk eBay listings",
    "eBay listing automation",
    "eBay dropshipping tool",
    "Printables eBay listings",
  ],
  authors: [{ name: "SimpleListr", url: "https://simplelistr.com" }],
  creator: "SimpleListr",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://simplelistr.com",
    siteName: "SimpleListr",
    title: "SimpleListr — AI-Powered eBay Listing Tool",
    description:
      "Automatically research, write, and list your eBay items with AI. Scale your eBay business without the manual work.",
    images: [
      {
        url: "/logo.png",
        width: 1080,
        height: 1080,
        alt: "SimpleListr — AI-Powered eBay Listing Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SimpleListr — AI-Powered eBay Listing Tool",
    description:
      "Automatically research, write, and list your eBay items with AI. Scale your eBay business without the manual work.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
