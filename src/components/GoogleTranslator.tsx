"use client";
import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslator() {
  useEffect(() => {
    // pull in the env var here so it's not a changing dependency
    const langs = process.env.NEXT_PUBLIC_TRANSLATE_LANGUAGES!;
    
    // stub the callback for the external script
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: langs,
          layout: (window as any)
            .google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []); // <-- run once on mount

  return (
    <>
      <div
        id="google_translate_element"
        className="fixed bottom-10 left-11 z-50 h-7 w-7"
      />
      <Script
        id="google-translate"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
