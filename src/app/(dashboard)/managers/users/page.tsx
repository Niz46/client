// File: src/app/(dashboard)/managers/users/page.tsx
"use client";

import React from "react";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetAllTenantsQuery,
  useUpdateTenantSettingsMutation,
} from "@/state/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

export default function AllUsersPage() {
  // 1️⃣ Fetch all tenants
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllTenantsQuery();

  // 2️⃣ Mutation to toggle suspension
  const [updateTenant, { isLoading: isUpdating }] =
    useUpdateTenantSettingsMutation();

  const handleToggleSuspend = async (tenant: (typeof users)[0]) => {
    try {
      await updateTenant({
        cognitoId: tenant.cognitoId,
        // flip the flag (assumes your Prisma Tenant model has `isSuspended?: boolean`)
        isSuspended: !tenant.isSuspended,
      }).unwrap();
      toast.success(
        `User ${tenant.name} has been ${
          tenant.isSuspended ? "unsuspended" : "suspended"
        }.`
      );
      await refetch();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="p-6 text-red-600">Failed to load users.</p>;

  return (
    <main className="p-6 space-y-6 bg-white rounded-lg shadow">
      <Header
        title="Manage Users"
        subtitle="Filter, sort, and access detailed user profiles"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary-600">
            <tr>
              <th className="px-6 py-3 text-left text-white font-medium uppercase tracking-wide">
                Name
              </th>
              <th className="px-6 py-3 text-left text-white font-medium uppercase tracking-wide">
                Email
              </th>
              <th className="px-6 py-3 text-left text-white font-medium uppercase tracking-wide">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-white font-medium uppercase tracking-wide">
                Role
              </th>
              <th className="px-6 py-3 text-right text-white font-medium uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((u) => {
              // Safely format date or show dash
              let joined = "–";
              if (u.createdAt) {
                const d = new Date(u.createdAt);
                joined = d.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }

              return (
                <tr
                  key={u.cognitoId}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  {/* Name + avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.image ? (
                        <Image
                          src={u.image}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {u.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <span className="font-medium text-gray-800">
                        {u.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-700">{u.email}</td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-gray-700">{joined}</td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold",
                        u.role === "manager"
                          ? "bg-secondary-100 text-secondary-800"
                          : "bg-success-100 text-success-800"
                      )}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleToggleSuspend(u)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition",
                        u.isSuspended
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      )}
                    >
                      {u.isSuspended ? "Unsuspend" : "Suspend"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* fallback row must also have a key */}
            {users.length === 0 && (
              <tr key="no-users">
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
