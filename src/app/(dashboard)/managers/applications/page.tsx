"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useUpdateApplicationStatusMutation,
} from "@/state/api";
import { downloadFile } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ApplicationCard from "@/components/ApplicationCard";
import { CircleCheckBig, Download, File, Hospital } from "lucide-react";

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const [activeTab, setActiveTab] = useState("all");
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery(
    { userId: authUser?.cognitoInfo?.userId, userType: "manager" },
    { skip: !authUser?.cognitoInfo?.userId }
  );

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateApplicationStatus({ id, status }).unwrap();
      toast.success(`Application ${status.toLowerCase()}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDownloadAgreement = async (leaseId: number) => {
    toast.loading("Preparing agreement…");
    try {
      await downloadFile(
        `/leases/${leaseId}/agreement`,
        `lease_agreement_${leaseId}.pdf`
      );
      toast.success("Agreement downloaded!");
    } catch {
      toast.error("Failed to download agreement");
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error fetching applications</div>;

  const filtered = applications.filter((app) =>
    activeTab === "all" ? true : app.status.toLowerCase() === activeTab
  );

  return (
    <div className="dashboard-container">
      <Header
        title="Applications"
        subtitle="View and manage applications for your properties"
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full my-5"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="denied">Denied</TabsTrigger>
        </TabsList>

        {["all", "pending", "approved", "denied"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-5 w-full">
            {filtered
              .filter(
                (app) => tab === "all" || app.status.toLowerCase() === tab
              )
              .map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType="manager"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-5 w-full pb-4 px-4">
                    <div
                      className={`p-4 text-green-700 grow ${
                        application.status === "Approved"
                          ? "bg-green-100"
                          : application.status === "Denied"
                          ? "bg-red-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <div className="flex flex-wrap items-center">
                        <File className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span className="mr-2">
                          Application submitted on{" "}
                          {new Date(
                            application.applicationDate
                          ).toLocaleDateString()}
                          .
                        </span>
                        <CircleCheckBig className="w-5 h-5 mr-2" />
                        <span
                          className={`font-semibold ${
                            application.status === "Approved"
                              ? "text-green-800"
                              : application.status === "Denied"
                              ? "text-red-800"
                              : "text-yellow-800"
                          }`}
                        >
                          {application.status === "Approved" &&
                            "Application approved."}
                          {application.status === "Denied" &&
                            "Application denied."}
                          {application.status === "Pending" &&
                            "Pending review."}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                      <Link
                        href={`/managers/properties/${application.property.id}`}
                        className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50"
                        scroll={false}
                      >
                        <Hospital className="w-5 h-5 mr-2" />
                        Property Details
                      </Link>

                      {application.status === "Approved" &&
                        application.leaseId && (
                          <Button
                            onClick={() =>
                              handleDownloadAgreement(application.leaseId!)
                            }
                            className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            Download Agreement
                          </Button>
                        )}

                      {application.status === "Pending" && (
                        <>
                          <Button
                            onClick={() =>
                              handleStatusChange(application.id, "Approved")
                            }
                            className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-500"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() =>
                              handleStatusChange(application.id, "Denied")
                            }
                            className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-500"
                          >
                            Deny
                          </Button>
                        </>
                      )}

                      {application.status === "Denied" && (
                        <Button
                          onClick={() =>
                            toast(
                              <>
                                <div className="font-semibold">
                                  {application.tenant.name}
                                </div>
                                <div>{application.tenant.email}</div>
                                <div>{application.tenant.phoneNumber}</div>
                              </>
                            )
                          }
                          className="w-full sm:w-auto bg-gray-800 text-white py-2 px-4 rounded-md"
                        >
                          Contact User
                        </Button>
                      )}
                    </div>
                  </div>
                </ApplicationCard>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Applications;
