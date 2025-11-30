// src/components/TawkChat.tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function TawkChat() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

  useEffect(() => {
    // set globals before the external script runs (just like the original snippet)
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
  }, []);

  if (!propertyId || !widgetId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "TawkChat: missing NEXT_PUBLIC_TAWK_PROPERTY_ID or NEXT_PUBLIC_TAWK_WIDGET_ID"
      );
    }
    return null;
  }

  return (
    <Script
      id="tawk-loader"
      strategy="afterInteractive"
      src={`https://embed.tawk.to/${propertyId}/${widgetId}`}
      onError={(e) => {
        if (process.env.NODE_ENV !== "production")
          console.error("Tawk script failed to load", e);
      }}
    />
  );
}
