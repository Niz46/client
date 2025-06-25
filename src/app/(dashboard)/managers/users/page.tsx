// File: src/app/(dashboard)/managers/users/page.tsx
"use client";

import React from "react";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAllTenantsQuery, useSuspendTenantMutation } from "@/state/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AllUsersPage() {
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllTenantsQuery();

  const [updateTenant, { isLoading: isUpdating }] = useSuspendTenantMutation();

  const handleToggleSuspend = async (u: (typeof users)[0]) => {
    const newSuspended = !u.isSuspended;

    try {
      await updateTenant({
        cognitoId: u.cognitoId,
        isSuspended: newSuspended,
      }).unwrap();

      await refetch();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="p-6 text-red-600">Failed to load users.</p>;

  return (
    <main className="p-6 space-y-6">
      <Header
        title="Manage Users"
        subtitle="Filter, sort, and access detailed user profiles"
      />

      {/* ── TABLE FOR md+ ─────────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary-600">
            <tr>
              {["Name", "Email", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-white font-medium uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((u) => {
              return (
                <tr
                  key={u.cognitoId}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {u.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="font-medium text-gray-800">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="px-6 py-4 text-gray-700">{u.email}</td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <Button
                      disabled={isUpdating}
                      onClick={() => handleToggleSuspend(u)}
                      className={cn(
                        "inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium transition",
                        u.isSuspended
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100   text-red-700   hover:bg-red-200"
                      )}
                    >
                      {u.isSuspended ? "Unsuspend" : "Suspend"}
                    </Button>
                  </td>
                </tr>
              );
            })}
            {!users.length && (
              <tr key="no-users">
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── CARD VIEW FOR sm ───────────────────────────────────────────── */}
      <div className="space-y-4 md:hidden">
        {users.map((u) => {
          return (
            <div
              key={u.cognitoId}
              className="bg-white rounded-lg shadow p-4 flex flex-col space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {u.image ? (
                    <Image
                      src={u.image}
                      alt={u.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {u.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{u.name}</p>
                    <p className="text-gray-500 text-sm">{u.email}</p>
                  </div>
                </div>
                <Button
                  disabled={isUpdating}
                  onClick={() => handleToggleSuspend(u)}
                  className={cn(
                    "inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium transition",
                    u.isSuspended
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100   text-red-700   hover:bg-red-200"
                  )}
                >
                  {u.isSuspended ? "Unsuspend" : "Suspend"}
                </Button>
              </div>
            </div>
          );
        })}
        {!users.length && (
          <p className="text-center text-gray-500">No users found.</p>
        )}
      </div>
    </main>
  );
}
