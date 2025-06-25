// src/components/StatsCard.tsx
import React from "react";
import Image from "next/image";
import { calculateTrendPercentage } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  headerTitle: string;
  total: number;
  currentMonthCount: number;
  lastMonthCount: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  headerTitle,
  total,
  currentMonthCount,
  lastMonthCount,
}) => {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );
  const isDecrement = trend === "decrement";
  return (
    <article className="stats-card bg-white rounded-lg shadow p-4">
      <h3 className="text-base font-medium">{headerTitle}</h3>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="text-3xl font-semibold">{total}</div>
          <div className="flex items-center gap-1 text-sm">
            <Image
              src={`/${
                isDecrement ? "arrow-down-red.svg" : "arrow-up-green.svg"
              }`}
              width={16}
              height={16}
              alt={isDecrement ? "decrease" : "increase"}
            />
            <span
              className={cn(
                "font-medium",
                isDecrement ? "text-red-500" : "text-green-600"
              )}
            >
              {Math.round(percentage)}%
            </span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>
        <Image
          src={`/${isDecrement ? "decrement.svg" : "increment.svg"}`}
          width={64}
          height={64}
          alt="trend graph"
        />
      </div>
    </article>
  );
};

export default StatsCard;
