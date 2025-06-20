"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllTenantsQuery,
  useSendEmailToAllMutation,
  useSendEmailToUserMutation,
} from "@/state/api";
import Image from "next/image";

// Schema includes userId and refines single-sends
const emailSchema = z
  .object({
    recipientType: z.enum(["all", "single"]),
    userId: z.string().optional(),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
  })
  .refine((data) => data.recipientType === "all" || Boolean(data.userId), {
    message: "Please select a tenant when sending to a single user",
    path: ["userId"],
  });

type EmailForm = z.infer<typeof emailSchema>;

const EmailPage: React.FC = () => {
  const {
    data: tenants = [],
    isLoading: tenantsLoading,
    isError: tenantsError,
  } = useGetAllTenantsQuery();

  const [sendToAll] = useSendEmailToAllMutation();
  const [sendToUser] = useSendEmailToUserMutation();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      recipientType: "all",
      userId: "",
      subject: "",
      message: "",
    },
  });

  const recipientType = watch("recipientType");

  const onSubmit: SubmitHandler<EmailForm> = async (data) => {
    try {
      if (data.recipientType === "all") {
        await sendToAll({
          subject: data.subject,
          message: data.message,
        }).unwrap();
      } else {
        const tenant = tenants.find((t) => t.cognitoId === data.userId);
        if (!tenant) throw new Error("Tenant not found");
        await sendToUser({
          email: tenant.email,
          subject: data.subject,
          message: data.message,
        }).unwrap();
      }
      // toast only, no alert
      // example: import { toast } from 'react-hot-toast'; toast.success
    } catch (err) {
      console.error(err);
      // toast.error
    }
  };

  return (
    <div className="pt-8 pb-5 px-8">
      {/* Header with banner image and emoji */}
      <div className="mb-6 flex items-center space-x-4">
        <Image
          src="/landing-icon-wand.png"
          alt="Communication Center"
          className="h-16 w-16 rounded-full"
          width={16}
          height={16}
          priority
        />
        <div>
          <h1 className="text-2xl font-semibold flex items-center">
            📬 Communication Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Send announcements or individual messages to your tenants
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Recipient Type */}
          <div>
            <label className="block mb-1 font-medium">Recipient Type</label>
            <Controller
              control={control}
              name="recipientType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-blue-500">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tenants</SelectItem>
                    <SelectItem value="single">Individual Tenant</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.recipientType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recipientType.message}
              </p>
            )}
          </div>

          {/* Individual Tenant selector */}
          {recipientType === "single" && (
            <div>
              <label className="block mb-1 font-medium">Select Tenant</label>
              {tenantsError && (
                <p className="text-red-500 text-sm">
                  Failed to load tenants. Please try again.
                </p>
              )}
              <Controller
                control={control}
                name="userId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          tenantsLoading ? "Loading..." : "Choose tenant"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((t) => (
                        <SelectItem key={t.cognitoId} value={t.cognitoId}>
                          {t.name} — {t.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.userId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userId.message}
                </p>
              )}
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block mb-1 font-medium">Subject</label>
            <Input
              {...register("subject")}
              placeholder="Subject"
              className="border-green-500"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <Textarea
              {...register("message")}
              rows={6}
              placeholder="Your message here..."
              className="border-yellow-500"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? '⌛ Sending…' : '📤 Send Message'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailPage;