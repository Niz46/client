"use client";
import {
  useGetPendingDepositsQuery,
  useApproveDepositMutation,
  useDeclineDepositMutation,
} from "@/state/api";
import { Button } from "@/components/ui/button";

export default function PendingDeposits() {
  const { data: deposits = [] } = useGetPendingDepositsQuery();
  const [approve] = useApproveDepositMutation();
  const [decline] = useDeclineDepositMutation();

  return (
    <div>
      <h2>Pending Deposits</h2>
      {deposits.map(d => (
        <div key={d.id} className="flex gap-4">
          <span>{d.lease.tenant.name}</span>
          <span>${d.amountDue}</span>
          <Button onClick={() => approve({ id: d.id })}>Approve</Button>
          <Button onClick={() => decline({ id: d.id })}>Decline</Button>
        </div>
      ))}
    </div>
  );
}
