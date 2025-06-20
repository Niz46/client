// File: src/components/ApplicationModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ApplicationFormData, applicationSchema } from "@/lib/schemas";
import {
  useCreateApplicationMutation,
  useGetAuthUserQuery,
  useGetPropertyQuery,
} from "@/state/api";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
}

const ApplicationModal = ({
  isOpen,
  onClose,
  propertyId,
}: ApplicationModalProps) => {
  const [createApplication] = useCreateApplicationMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const { data: property, isLoading: propertyLoading } =
    useGetPropertyQuery(propertyId);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { name: "", email: "", phoneNumber: "", message: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose]);

  const onSubmit = async (data: ApplicationFormData) => {
    if (!authUser || authUser.userRole !== "tenant") return;
    if (!property) return;

    setIsSubmitting(true);
    try {
      await createApplication({
        applicationDate: new Date().toISOString(),
        status: "Pending",
        propertyId: property.id,
        tenantCognitoId: authUser.cognitoInfo.userId,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        message: data.message,
      }).unwrap();

      toast.success("Application submitted! Please follow payment instructions.");
      setShowSuccess(true);
    } catch (err) {
      console.error("Application creation failed:", err);
      toast.error("There was an issue submitting your application. Please try again.");
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white max-w-lg mx-auto">
          <DialogHeader className="mb-4">
            <DialogTitle>Submit Application for this Property</DialogTitle>
          </DialogHeader>

          {propertyLoading || !property ? (
            <div className="p-8 text-center">Loading property details…</div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 px-4 pb-4"
              >
                <CustomFormField
                  name="name"
                  label="Name"
                  type="text"
                  placeholder="Enter your full name"
                />
                <CustomFormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                />
                <CustomFormField
                  name="phoneNumber"
                  label="Phone Number"
                  type="text"
                  placeholder="Enter your phone number"
                />
                <CustomFormField
                  name="message"
                  label="Message (Optional)"
                  type="textarea"
                  placeholder="Enter any additional information"
                />

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> By clicking “Invest & Pay Application
                    Fee,” you consent to a non‑refundable fee of{" "}
                    <span className="font-semibold">
                      €{property.applicationFee.toFixed(2)}
                    </span>{" "}
                    (EUR). Your application will remain pending until payment
                    and approval are complete.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="bg-primary-700 text-white w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing…"
                    : "Invest & Pay Application Fee"}
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={() => {}}>
        <DialogContent className="bg-white max-w-md mx-auto">
          <DialogHeader className="mb-4">
            <DialogTitle>Thank You!</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 space-y-4 text-center">
            <p>
              Your application has been successfully submitted and is pending
              review. To complete your transaction, please add this property to
              your Favorites and follow the payment instructions provided there.
            </p>
            <p>This message will automatically close in 20 seconds.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationModal;
