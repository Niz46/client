"use client";

import { useGetAuthUserQuery, useGetPropertyQuery } from "@/state/api";
import { useParams } from "next/navigation";
import React, { useState, useMemo } from "react";
import ImagePreviews from "./ImagePreviews";
import PropertyOverview from "./PropertyOverview";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import ContactWidget from "./ContactWidget";
import ApplicationModal from "./ApplicationModal";

const SingleListing = () => {
  const { id } = useParams();
  const propertyId = Number(id);

  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: property,
    isLoading: isPropertyLoading,
    isError: isPropertyError,
  } = useGetPropertyQuery(propertyId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // whenever `property.photoUrls` changes, pick two at random
  const previewImages = useMemo(() => {
    if (!property?.photoUrls?.length) return [];
    const shuffled = [...property.photoUrls].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [property?.photoUrls]);

  if (isPropertyLoading) {
    return <div className="p-8 text-center">Loading listing…</div>;
  }
  if (isPropertyError || !property) {
    return <div className="p-8 text-center">Listing not found.</div>;
  }

  return (
    <div>
      {/* Use the two random photoUrls, or fall back if none */}
      <ImagePreviews
        images={
          previewImages.length
            ? previewImages
            : ["/singlelisting-3.jpg", "/singlelisting-2.jpg"]
        }
      />

      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  );
};

export default SingleListing;
