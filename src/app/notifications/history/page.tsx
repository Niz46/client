// File: src/app/notifications/history/page.tsx
"use client";

import React from "react";
import { useGetUserAlertsQuery } from "@/state/api";
import { Heading } from "@aws-amplify/ui-react";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

export default function NotificationsHistory() {
  const { data: alerts = [], isLoading, isError } = useGetUserAlertsQuery();

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500">Error loading notifications.</p>
    );

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(229, 216, 216, 0.513),
          rgb(206, 85, 85)
        )`,
      }}
    >
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Heading level={2} className="mb-6">
          All Notifications
        </Heading>

        {alerts.length ? (
          <motion.ul
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {alerts.map((a) => (
              <motion.li
                key={a.id}
                className="p-4 border-l-4 border-primary-600 bg-primary-50 rounded"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <div className="text-sm text-gray-500">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 text-gray-800">{a.text}</div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-center text-gray-800 mt-3">
            You have no notifications.
          </p>
        )}
      </motion.div>
    </div>
  );
}
