// File: src/components/DownloadAgreementButton.tsx
"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  leaseId: number;
}

export const DownloadAgreementButton: React.FC<Props> = ({ leaseId }) => {
  const handleClick = async () => {
    toast(`Downloading agreement #${leaseId}…`);
    try {
      await downloadFile(
        `/leases/${leaseId}/agreement`,
        `lease_agreement_${leaseId}.pdf`
      );
      toast("Agreement downloaded!");
    } catch {
      toast("Failed to download agreement.");
    }
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
