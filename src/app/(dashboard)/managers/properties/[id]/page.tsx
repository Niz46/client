// File: client/src/app/(dashboard)/managers/properties/[id]/page.tsx

"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ArrowLeft, Check, ArrowDownToLine } from "lucide-react";
import { useGetPropertyQuery, useGetPropertyLeasesQuery, useGetPaymentsQuery } from "@/state/api";
import { Lease } from "@/types/prismaTypes";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const PropertyTenants = () => {
  const { id } = useParams();
  const propertyId = Number(id);

  const { data: property, isLoading: propLoading } = useGetPropertyQuery(propertyId);
  const { data: leases, isLoading: leaseLoading } = useGetPropertyLeasesQuery(propertyId);

  if (propLoading || leaseLoading) return <Loading />;

  // Inline LeaseRow component (so we stay in one file)
  const LeaseRow: React.FC<{ lease: Lease }> = ({ lease }) => {
    // Fetch payments for this lease
    const { data: payments = [] } = useGetPaymentsQuery(lease.id);
    const now = new Date();
    const current = payments.find(
      p =>
        new Date(p.dueDate).getMonth() === now.getMonth() &&
        new Date(p.dueDate).getFullYear() === now.getFullYear()
    );
    const status = current?.paymentStatus ?? "Not Paid";

    return (
      <TableRow key={lease.id} className="h-24">
        {/* Investor */}
        <TableCell>
          <div className="flex items-center space-x-3">
            <Image
              src="/landing-i1.png"
              alt={lease.tenant.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-semibold">{lease.tenant.name}</div>
              <div className="text-sm text-gray-500">{lease.tenant.email}</div>
            </div>
          </div>
        </TableCell>

        {/* Lease Period */}
        <TableCell>
          {new Date(lease.startDate).toLocaleDateString()} –{" "}
          {new Date(lease.endDate).toLocaleDateString()}
        </TableCell>

        {/* Monthly Rent */}
        <TableCell>${lease.rent.toFixed(2)}</TableCell>

        {/* Current Month Status */}
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              status === "Paid"
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            {status === "Paid" && (
              <Check className="w-4 h-4 inline-block mr-1" />
            )}
            {status}
          </span>
        </TableCell>

        {/* Contact */}
        <TableCell>{lease.tenant.phoneNumber}</TableCell>

        {/* Action */}
        <TableCell>
          <Button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50">
            <ArrowDownToLine className="w-4 h-4 mr-1" />
            Download Agreement
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="dashboard-container">
      <Link
        href="/managers/properties"
        className="flex items-center mb-4 hover:text-primary-500"
        scroll={false}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Back to Properties</span>
      </Link>

      <Header
        title={property?.name || "Property"}
        subtitle="Manage tenants and leases"
      />

      <div className="overflow-x-auto mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investor</TableHead>
              <TableHead>Lease Period</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Current Month Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leases?.map((lease) => (
              <LeaseRow key={lease.id} lease={lease} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PropertyTenants;
