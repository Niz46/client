// src/components/DownloadReceiptButton.tsx
"use client";

import React from "react";
import { ArrowDownToLineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/utils";

interface Props {
  paymentId: number;
}

export const DownloadReceiptButton: React.FC<Props> = ({ paymentId }) => {
  const handleClick = () => {
    downloadFile(
      `/payments/${paymentId}/receipt`,
      `receipt_${paymentId}.pdf`
    );
  };

  return (
    <Button
      onClick={handleClick}
      className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center font-semibold hover:bg-primary-700 hover:text-white transition"
    >
      <ArrowDownToLineIcon className="w-4 h-4 mr-1" />
      Download
    </Button>
  );
};
