"use client";

import React from "react";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ApplicationCard from "@/components/ApplicationCard";
import { Toaster, toast } from "sonner";
import { useGetApplicationsQuery, useGetAuthUserQuery } from "@/state/api";
import { useGetPropertyQuery } from "@/state/api"; // for fetching property details
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";
import { Property } from "@/types/prismaTypes";

// -----------------------------------------------------------------------------
// Helper: Format a Date or ISO string as “MMM d, yyyy” (e.g. “Jul 1, 2023”)
// -----------------------------------------------------------------------------
function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// -----------------------------------------------------------------------------
// Subcomponent: InvestmentCard
// Fetches the property for each application and calculates return based on price
// -----------------------------------------------------------------------------
interface InvestmentCardProps {
  application: {
    id: number;
    applicationDate: string;
    status: "Pending" | "Approved" | "Denied";
    propertyId: number;
    // ...other application fields...
  };
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ application }) => {
  const { id, applicationDate, status, propertyId } = application;

  // 1) Fetch property details for this application
  const {
    data: property,
    isLoading: propertyLoading,
    isError: propertyError,
  } = useGetPropertyQuery(propertyId);

  // 2) While the property is loading, show a small spinner or placeholder
  if (propertyLoading) {
    return (
      <div className="border rounded-lg p-6 text-center text-gray-500">
        Loading property details…
      </div>
    );
  }

  // 3) If property fetch failed, show an error card but still keep the application context
  if (propertyError || !property) {
    return (
      <div className="border rounded-lg p-6 text-red-500">
        Error loading property #{propertyId}.
      </div>
    );
  }

  // 4) Use the property’s pricePerMonth as the “principal” of the investment
  const principal = property.pricePerMonth;

  // 5) Parse invest date and compute end date (exactly one year later)
  const investDate = new Date(applicationDate);
  const endDate = new Date(investDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  // 6) Compute a 4% annual return on the principal
  const returnAmount = principal * 0.04;

  // 7) Next payment date is the same as the maturity date (one year later)
  const nextPaymentDate = endDate;

  // 8) Format dates and amounts for display
  const investDateStr = formatDate(investDate);
  const endDateStr = formatDate(endDate);
  const nextPaymentDateStr = formatDate(nextPaymentDate);

  const investedAmountStr = principal.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  const returnAmountStr = returnAmount.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  // 9) Build a status banner based on application.status
  let statusBanner: React.ReactNode;
  if (status === "Approved") {
    statusBanner = (
      <div className="bg-green-100 p-4 text-green-700 rounded-md flex items-center gap-2">
        <CircleCheckBig className="w-5 h-5" />
        Investment approved. You will receive{" "}
        <span className="font-semibold">{returnAmountStr}</span> on {endDateStr}.
      </div>
    );
  } else if (status === "Pending") {
    statusBanner = (
      <div className="bg-yellow-100 p-4 text-yellow-800 rounded-md flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Your investment is pending approval.
      </div>
    );
  } else {
    statusBanner = (
      <div className="bg-red-100 p-4 text-red-700 rounded-md flex items-center gap-2">
        <XCircle className="w-5 h-5" />
        Your investment was declined.
      </div>
    );
  }

  return (
    <ApplicationCard key={id} application={application} userType="renter">
      <div className="space-y-4 w-full px-4 pb-4">
        {/* Status Banner */}
        {statusBanner}

        {/* Investment Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Invested On:</p>
            <p className="font-medium">{investDateStr}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount Invested:</p>
            <p className="font-medium">{investedAmountStr}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Return (4%):</p>
            <p className="font-medium">{returnAmountStr}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Matures On:</p>
            <p className="font-medium">{endDateStr}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Next Payment Date:</p>
            <p className="font-medium">{nextPaymentDateStr}</p>
          </div>
        </div>

        {/* Download Receipt Button (only if approved) */}
        {status === "Approved" && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                toast.success("Your receipt is downloading…")
              }
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50 transition"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </button>
          </div>
        )}
      </div>
    </ApplicationCard>
  );
};

// -----------------------------------------------------------------------------
// COMPONENT: Applications (treated as Investments)
// -----------------------------------------------------------------------------
const Applications: React.FC = () => {
  // Fetch the authenticated user
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();

  // Fetch all applications for this tenant
  const {
    data: applications,
    isLoading: appsLoading,
    isError: appsError,
  } = useGetApplicationsQuery(
    {
      userId: authUser?.cognitoInfo?.userId,
      userType: "tenant",
    },
    { skip: !authUser?.cognitoInfo?.userId }
  );

  // Show a spinner until both queries finish
  if (authLoading || appsLoading) {
    return <Loading />;
  }

  // Handle errors or missing data
  if (appsError || !Array.isArray(applications)) {
    return (
      <div className="p-6 text-center text-red-500">
        Error fetching your investments.
      </div>
    );
  }

  // If no “applications” (investments) yet
  if (applications.length === 0) {
    return (
      <div className="dashboard-container px-6 py-8">
        <Header
          title="My Investments"
          subtitle="Track and manage your annual returns"
        />
        <div className="mt-6 text-center text-gray-600">
          You have not made any investments yet.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sonner toaster for toasts */}
      <Toaster position="top-right" richColors />

      <div className="dashboard-container px-6 py-8 space-y-6">
        <Header
          title="My Investments"
          subtitle="Track and manage your annual returns"
        />

        {/* Map over each application and render an InvestmentCard */}
        <div className="space-y-8">
          {applications.map((app) => (
            <InvestmentCard key={app.id} application={app} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Applications;
