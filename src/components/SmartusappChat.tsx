// src/components/SmartsuppChat.tsx
"use client";
import { useEffect } from "react";
import Script from "next/script";

export default function SmartsuppChat() {
  const key = process.env.NEXT_PUBLIC_SMARTSUPP_KEY!;

  useEffect(() => {
    // stub and set key before loader runs
    window._smartsupp = window._smartsupp || { _: [] };
    window._smartsupp.key = key;
  }, [key]);

  return (
    // load Smartsupp loader after hydration
    <Script
      id="smartsupp-loader"
      strategy="afterInteractive"
      src="https://www.smartsuppchat.com/loader.js"
    />
  );
}