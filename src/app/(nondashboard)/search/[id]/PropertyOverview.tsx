// File: src/components/PropertyOverview.tsx

import { useGetPropertyQuery } from "@/state/api";
import { MapPin, Star } from "lucide-react";
import React from "react";

interface PropertyOverviewProps {
  propertyId: number;
}

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <div className="p-8 text-center">Loading…</div>;
  if (isError || !property) {
    return <div className="p-8 text-center">Property not found.</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">
          {property.location?.country} / {property.location?.state} /{" "}
          <span className="font-semibold text-gray-600">
            {property.location?.city}
          </span>
        </div>
        <h1 className="text-3xl font-bold my-5">{property.name}</h1>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {property.location?.city}, {property.location?.state},{" "}
            {property.location?.country}
          </span>
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {property.averageRating.toFixed(1)} ({property.numberOfReviews}{" "}
              Reviews)
            </span>
            <span className="text-green-600">Verified Listing</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="border border-primary-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center gap-4 px-5">
          <div>
            <div className="text-sm text-gray-500">Monthly Rent</div>
            <div className="font-semibold">
              €{property.pricePerMonth.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bedrooms</div>
            <div className="font-semibold">{property.beds} bd</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bathrooms</div>
            <div className="font-semibold">{property.baths} ba</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Square Feet (m²)</div>
            <div className="font-semibold">
              {property.squareFeet.toLocaleString()} m²
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="my-16 leading-7 text-gray-600">
        <h2 className="text-xl font-semibold mb-5">About {property.name}</h2>
        <p>
          Experience elegant living in the heart of {property.location?.state} in this exquisite
          three-room apartment overlooking the historic Old Town. Recently fully
          renovated, it artfully combines classic house charm with modern
          comforts: high ceilings, herringbone parquet floors, original stucco
          moldings and floor-to-ceiling windows that flood the space with
          natural light. The open-plan living kitchen features custom oak
          cabinetry, top-of-the-line Miele appliances and a central island
          perfect for gourmet cooking evenings or a quick breakfast. In addition
          to two spacious bedrooms, you’ll find a luxurious bathroom with a
          freestanding tub and rain-shower, underfloor heating throughout, and a
          private storage room. The highlight: from the generous terrace, enjoy
          direct views of St. Stephen’s Cathedral and the city’s rooftops.
          Within a few minutes’ walk you can reach the Naschmarkt, renowned
          museums (Albertina, Kunsthistorisches Museum) and top-tier cafés,
          pastry shops and restaurants offering anything from traditional
          Austrian specialties to international fine dining. Transport
          connections are excellent: subway and tram stations are just minutes
          away, as are the University of {property.location?.state} and several international
          schools. A private cellar compartment and the option of a bicycle
          storage space complete this all-inclusive package. Embrace urban
          living in one of Europe’s most coveted locations—this apartment
          epitomizes the pinnacle of residential comfort in {property.location?.state}.
        </p>
      </div>
    </div>
  );  
};

export default PropertyOverview;
