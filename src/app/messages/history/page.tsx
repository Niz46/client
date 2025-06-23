// File: src/app/messages/history/page.tsx
"use client";

import React from "react";
import { useGetUserMessagesQuery } from "@/state/api";
import { Heading } from "@aws-amplify/ui-react";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

export default function MessagesHistory() {
  const { data: messages = [], isLoading, isError } = useGetUserMessagesQuery();

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Error loading messages.</p>;

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(229, 216, 216, 0.761),
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
          All Messages
        </Heading>

        {messages.length ? (
          <motion.ul
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {messages.map((m) => (
              <motion.li
                key={m.id}
                className="p-4 border-l-4 border-secondary-500 bg-secondary-50 rounded"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <div className="text-sm text-gray-500">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 text-gray-800">{m.text}</div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-center mt-3 text-gray-800">
            You have no messages.
          </p>
        )}
      </motion.div>
    </div>
  );
}
