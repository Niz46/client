// File: src/app/(dashboard)/managers/dashboard/page.tsx
"use client";

import React from "react";
import {
  useGetAuthUserQuery,
  useGetAllTenantsQuery,
  useGetManagerPropertiesQuery,
  useGetApplicationsQuery,
} from "@/state/api";
import StatsCard from "@/components/StatsCard";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const { data: tenants = [], isLoading: usersLoading } =
    useGetAllTenantsQuery();
  const managerId = authUser?.cognitoInfo?.userId ?? "";
  const {
    data: properties = [],
    isLoading: propsLoading,
  } = useGetManagerPropertiesQuery(managerId, { skip: !managerId });
  const {
    data: applications = [],
    isLoading: appsLoading,
  } = useGetApplicationsQuery({});

  if (authLoading || usersLoading || propsLoading || appsLoading) {
    return <Loading />;
  }

  const totalUsers = tenants.length;
  const totalProperties = properties.length;
  const totalApplications = applications.length;

  const statusCounts = applications.reduce<Record<string, number>>(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8 space-y-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary-900">
        Admin Dashboard
      </h1>

      {/* ─── STATS CARDS ───────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>

      {/* ─── STATUS BARS ───────────────────────────────────────────── */}
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

      {/* ─── LATEST PROPERTIES ─────────────────────────────────────── */}
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

        {/* desktop/tablet table */}
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
                  <td
                    colSpan={4}
                    className="py-6 text-center text-gray-500"
                  >
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* mobile card list */}
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

      {/* ─── LATEST APPLICATIONS ───────────────────────────────────── */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-800">
            Latest Applications
          </h2>
          <Link
            href="/managers/applications"
            className="text-secondary-500 hover:text-secondary-600 font-medium"
          >
            View All →
          </Link>
        </div>

        {/* desktop/tablet table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-primary-600">
              <tr>
                {["Tenant", "Property", "Date", "Status"].map((h) => (
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
              {applications.slice(0, 5).map((a) => (
                <tr
                  key={a.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  <td className="px-6 py-4 text-gray-800">{a.name}</td>
                  <td className="px-6 py-4">{a.property.name}</td>
                  <td className="px-6 py-4">
                    {new Date(a.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 capitalize">{a.status}</td>
                </tr>
              ))}
              {!applications.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-gray-500"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* mobile card list */}
        <div className="space-y-4 md:hidden">
          {applications.map((a) => (
            <div
              key={a.id}
              className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col gap-2"
            >
              <p className="font-semibold text-gray-800">{a.name}</p>
              <p className="text-gray-600 text-sm">{a.property.name}</p>
              <p className="text-gray-600 text-sm">
                {new Date(a.applicationDate).toLocaleDateString()}
              </p>
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-secondary-100 text-secondary-800 rounded">
                {a.status}
              </span>
            </div>
          ))}
          {!applications.length && (
            <p className="text-center text-gray-500">No applications found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
