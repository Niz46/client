// File: src/global.d.ts
export {};

declare global {
  interface Window {
    _smartsupp?: { key?: string; _: any[] };
    smartsupp?: unknown;
    googleTranslateElementInit?: () => void;
  }
}

declare interface StatsCardProps {
  headerTitle: string;
  total: number;
  lastMonthCount: number;
  currentMonthCount: number;
}