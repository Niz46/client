import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import GoogleTranslator from "@/components/GoogleTranslator";
import SmartsuappChat from "@/components/SmartusappChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miles Home - Real Estate Platform",
  description:
    "Miles Home is a real estate platform that connects buyers, sellers, and renters with properties Austria and United State. Discover your dream home today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        <Toaster closeButton />

        {/* Third-party widgets */}
        <GoogleTranslator />
        <SmartsuappChat />
      </body>
    </html>
  );
}
