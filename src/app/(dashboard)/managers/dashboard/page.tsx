"use client";

import React, { useState } from "react";
import {
  useGetAuthUserQuery,
  useGetAllTenantsQuery,
  useGetManagerPropertiesQuery,
  useGetApplicationsQuery,
  useGetPendingDepositsQuery,
  useApproveDepositMutation,
  useDeclineDepositMutation,
  useFundTenantMutation,
} from "@/state/api";
import StatsCard from "@/components/StatsCard";
import Loading from "@/components/Loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UnifiedDashboard() {
  // — AUTH & BASIC DATA FETCHES —
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const { data: tenants = [], isLoading: tenantsLoading } =
    useGetAllTenantsQuery();
  const managerId = authUser?.cognitoInfo?.userId ?? "";
  const { data: properties = [], isLoading: propertiesLoading } =
    useGetManagerPropertiesQuery(managerId, { skip: !managerId });
  const { data: applications = [], isLoading: applicationsLoading } =
    useGetApplicationsQuery({});

  // — MANAGER‑SPECIFIC DATA & MUTATIONS —
  const { data: deposits = [], isLoading: depositsLoading } =
    useGetPendingDepositsQuery();
  const [approve] = useApproveDepositMutation();
  const [decline] = useDeclineDepositMutation();
  const [fundTenant] = useFundTenantMutation();

  // — UI STATE FOR “ADD FUNDS” PROMPT —
  const [fundingTenant, setFundingTenant] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState<number>(0);

  // — LOADING GUARD —
  if (
    authLoading ||
    tenantsLoading ||
    propertiesLoading ||
    applicationsLoading ||
    depositsLoading
  ) {
    return <Loading />;
  }

  // — CALCULATED METRICS —
  const totalUsers = tenants.length;
  const totalProperties = properties.length;
  const totalApplications = applications.length;
  const totalBalances = tenants.reduce((sum, t) => sum + (t.balance ?? 0), 0);
  const statusCounts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8 space-y-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary-900">
        Admin Dashboard
      </h1>

      {/* ─── STATS CARDS ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          headerTitle="Total Balances (USD)"
          total={parseFloat(totalBalances.toFixed(2))}
          currentMonthCount={0}
          lastMonthCount={0}
        />
        <StatsCard
          headerTitle="Total Users"
          total={totalUsers}
          currentMonthCount={0}
          lastMonthCount={0}
        />
        <StatsCard
          headerTitle="Total Properties"
          total={totalProperties}
          currentMonthCount={0}
          lastMonthCount={0}
        />
        <StatsCard
          headerTitle="Total Applications"
          total={totalApplications}
          currentMonthCount={0}
          lastMonthCount={0}
        />
        <StatsCard
          headerTitle="Pending Deposits"
          total={deposits.length}
          currentMonthCount={0}
          lastMonthCount={0}
        />
      </section>

      {/* ─── APPLICATIONS BY STATUS ─── */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-primary-800 mb-4">
          Applications by Status
        </h2>
        <div className="space-y-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const pct = totalApplications
              ? Math.round((count / totalApplications) * 100)
              : 0;
            return (
              <div key={status}>
                <div className="flex justify-between text-gray-700 mb-1">
                  <span className="capitalize font-medium">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {!totalApplications && (
            <p className="text-center text-gray-500 mt-4">
              No applications yet.
            </p>
          )}
        </div>
      </section>

      {/* ─── LATEST PROPERTIES ─── */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-800">
            Latest Properties
          </h2>
          <Link
            href="/managers/properties"
            className="text-secondary-500 hover:text-secondary-600 font-medium"
          >
            View All →
          </Link>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-primary-600">
              <tr>
                {["Name", "Beds", "Baths", "Price"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-white font-medium uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.slice(0, 5).map((p) => (
                <tr
                  key={p.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  <td className="px-6 py-4 text-gray-800">{p.name}</td>
                  <td className="px-6 py-4">{p.beds}</td>
                  <td className="px-6 py-4">{p.baths}</td>
                  <td className="px-6 py-4 text-gray-800">
                    ${p.pricePerMonth}
                  </td>
                </tr>
              ))}
              {!properties.length && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {properties.map((p) => (
            <div
              key={p.id}
              className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col gap-2"
            >
              <h3 className="font-semibold text-gray-800">{p.name}</h3>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Beds: {p.beds}</span>
                <span>Baths: {p.baths}</span>
              </div>
              <div className="text-gray-800 font-medium">
                ${p.pricePerMonth}/mo
              </div>
            </div>
          ))}
          {!properties.length && (
            <p className="text-center text-gray-500">No properties found.</p>
          )}
        </div>
      </section>

      {/* ─── PENDING DEPOSITS ─── */}
      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Pending Deposits</h2>
        {deposits.length === 0 ? (
          <p className="text-gray-500">No pending deposits.</p>
        ) : (
          <ul className="divide-y">
            {deposits.map((d) => (
              <li key={d.id} className="py-3 flex justify-between items-center">
                <div>
                  <p>
                    Tenant: <strong>{d.lease.tenant.name}</strong> ($
                    {d.amountDue.toFixed(2)})
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(d.paymentDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await approve({ id: d.id }).unwrap();
                      toast.success("Deposit approved");
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      await decline({ id: d.id }).unwrap();
                      toast.error("Deposit declined");
                    }}
                  >
                    Decline
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ─── ALL TENANTS + “ADD FUNDS” ─── */}
      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">All Tenants</h2>
        <ul className="divide-y">
          {tenants.map((u) => (
            <li
              key={u.cognitoId}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setFundingTenant(u.cognitoId);
                  setFundAmount(0);
                }}
              >
                Add Funds
              </Button>
            </li>
          ))}
        </ul>

        {/* ADD FUNDS MODAL */}
        {fundingTenant && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 w-full max-w-sm">
              <h3 className="text-lg font-semibold">Add Funds</h3>
              <input
                type="number"
                min={0}
                value={fundAmount}
                onChange={(e) => setFundAmount(+e.target.value)}
                className="w-full border px-2 py-1 rounded"
                placeholder="Amount"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setFundingTenant(null)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={fundAmount <= 0}
                  onClick={async () => {
                    try {
                      await fundTenant({
                        cognitoId: fundingTenant,
                        amount: fundAmount,
                      }).unwrap();
                      toast.success("Funds added");
                    } catch {
                      toast.error("Failed to add funds");
                    } finally {
                      setFundingTenant(null);
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
