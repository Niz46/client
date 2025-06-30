"use client";

import React, { useState, useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  useGetAuthUserQuery,
  useGetTenantPaymentsQuery,
  useCreateDepositRequestMutation,
  useWithdrawFundsMutation,
} from "@/state/api";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function TenantDashboard() {
  // Data hooks
  const { data: auth, isLoading: authLoading } = useGetAuthUserQuery();
  const [createDeposit, { isLoading: depositLoading }] =
    useCreateDepositRequestMutation();
  const [withdraw, { isLoading: withdrawLoading }] = useWithdrawFundsMutation();
  const tenantId = auth?.userInfo?.cognitoId;
  const { data: payments = [] } = useGetTenantPaymentsQuery(
    tenantId ?? skipToken
  );

  // Local state
  const [depositAmt, setDepositAmt] = useState<number>(0);
  const [withdrawAmt, setWithdrawAmt] = useState<number>(0);
  const [withdrawMethod, setWithdrawMethod] = useState<string>("");
  const [destinationDetails, setDestinationDetails] = useState<string>("");
  const [showNoLeaseDialog, setShowNoLeaseDialog] = useState<boolean>(false);

  // Effect to auto-close the “no lease” dialog after 12s
  useEffect(() => {
    if (showNoLeaseDialog) {
      const timer = setTimeout(() => setShowNoLeaseDialog(false), 12_000);
      return () => clearTimeout(timer);
    }
  }, [showNoLeaseDialog]);

  const balance = auth.userInfo.balance ?? 0;
  const totalTransactions = payments.length;
  const leaseId = auth.userInfo.leases?.[0]?.id;
  const pendingDeposits = payments.filter(
    (p) => p.type === "DEPOSIT" && !p.approved
  ).length;

  // Guards
  if (authLoading) return <Loading />;
  if (!auth?.userInfo) {
    return <p className="p-6 text-red-600">Unable to load your account.</p>;
  }

  // Handlers

  const handleDeposit = async () => {
    if (!leaseId) {
      return;
    }
    try {
      await createDeposit({ leaseId, amount: depositAmt }).unwrap();
      toast.success("Deposit request submitted");
      setDepositAmt(0);
    } catch {
      toast.error("Failed to submit deposit");
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw({
        amount: withdrawAmt,
        destinationType: withdrawMethod,
        destinationDetails,
      }).unwrap();
      toast.success("Withdrawal successful");
      // reset
      setWithdrawAmt(0);
      setWithdrawMethod("");
      setDestinationDetails("");
    } catch {
      toast.error("Failed to withdraw funds");
    }
  };

  return (
    <main className="flex-1 p-6 space-y-8 overflow-y-auto bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome, <span className="font-medium">{auth.userInfo.name}</span>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-2xl font-semibold">${balance.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <ArrowDownTrayIcon className="h-8 w-8 text-yellow-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Pending Deposits</p>
            <p className="text-2xl font-semibold">{pendingDeposits}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <ChartBarIcon className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-2xl font-semibold">{totalTransactions}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {/* Deposit Trigger */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="lg">
              Make a Deposit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Deposit Request</DialogTitle>
            <DialogDescription>
              Enter the amount you paid to request a deposit.
            </DialogDescription>
            <div className="mt-4">
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={depositAmt}
                onChange={(e) => setDepositAmt(+e.target.value)}
                placeholder="Amount (e.g. 1200.00)"
              />
            </div>
            <DialogFooter className="space-x-2">
              <Button variant="outline" onClick={() => setDepositAmt(0)}>
                Cancel
              </Button>
              <Button
                className="mb-4"
                disabled={depositAmt <= 0 || depositLoading}
                onClick={handleDeposit}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* ── No‑Lease Info Dialog ───────────────────────────────────────── */}
        <Dialog open={showNoLeaseDialog} onOpenChange={() => {}}>
          <DialogContent className="bg-white max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Oops—No Active Lease</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 space-y-4 text-center">
              <p>
                It looks like you don’t have an active lease on file yet, so we
                can’t process a deposit. To get one:
              </p>
              <ul className="list-disc list-inside text-left">
                <li>
                  Browse properties in the app and submit an application for the
                  one you like.
                </li>
                <li>
                  Once your application is approved, we’ll set up a lease and
                  you can come back to make your deposit here.
                </li>
                <li>
                  If you have questions, open the live chat (bottom‑right) and
                  our support team can help.
                </li>
              </ul>
              <p>This message will close automatically in 12 seconds.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Withdraw Trigger */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="lg">
              Withdraw Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the amount and destination for your withdrawal (max $
              {balance.toFixed(2)}).
            </DialogDescription>
            <div className="mt-4 space-y-4">
              {/* Method */}
              <div>
                <label
                  htmlFor="withdraw-method"
                  className="block text-sm font-medium text-gray-700"
                >
                  Destination
                </label>
                <select
                  id="withdraw-method"
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="mt-1 px-2 h-10 border block w-full border-gray-300 rounded-md"
                >
                  <option value="">Select method…</option>
                  <option value="BankTransfer">Bank Transfer</option>
                  <option value="Crypto">Crypto Wallet</option>
                </select>
              </div>
              {/* Details */}
              <div>
                <Input
                  type="text"
                  placeholder={
                    withdrawMethod === "BankTransfer"
                      ? "Account number / Bank name"
                      : "Wallet address"
                  }
                  value={destinationDetails}
                  onChange={(e) => setDestinationDetails(e.target.value)}
                />
              </div>
              {/* Amount */}
              <div>
                <Input
                  type="number"
                  min={0.01}
                  max={balance}
                  step={0.01}
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(+e.target.value)}
                  placeholder={`Max ${balance.toFixed(2)}`}
                />
              </div>
            </div>
            <DialogFooter className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setWithdrawAmt(0);
                  setWithdrawMethod("");
                  setDestinationDetails("");
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  withdrawAmt <= 0 ||
                  withdrawAmt > balance ||
                  !withdrawMethod ||
                  !destinationDetails ||
                  withdrawLoading
                }
                onClick={handleWithdraw}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction History */}
      <section id="transactions" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Transaction History
        </h2>
        {payments.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Type", "Amount", "Date", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {p.type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      ${p.amountPaid.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(p.paymentDate).toLocaleDateString("en-US")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {p.approved ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
