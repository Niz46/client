// src/components/DownloadAgreementButton.tsx
"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/utils";

interface Props {
  leaseId: number;
}

export const DownloadAgreementButton: React.FC<Props> = ({ leaseId }) => {
  const handleClick = () => {
    downloadFile(
      `/leases/${leaseId}/agreement`,
      `lease_agreement_${leaseId}.pdf`
    );
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center hover:bg-primary-700 hover:text-white transition"
    >
      <Download className="w-5 h-5 mr-2" />
      Download Agreement
    </Button>
  );
};
