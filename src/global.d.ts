// File: src/global.d.ts
export {};

declare global {
  interface Window {
    // Google Translate helper (if you use it)
    googleTranslateElementInit?: () => void;

    // Tawk.to globals (moved here from the component)
    Tawk_API?: any;
    Tawk_LoadStart?: Date | number;
  }
}

declare interface StatsCardProps {
  headerTitle: string;
  total: number;
  lastMonthCount: number;
  currentMonthCount: number;
}
