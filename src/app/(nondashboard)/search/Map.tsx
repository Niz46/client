"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const filters = useAppSelector((state) => state.global.filters);
  const { data: properties, isLoading, isError } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: filters.coordinates || [-74.5, 40],
      zoom: 9,
    });

    properties.forEach((property) => {
      const marker = createPropertyMarker(property, map);
      // (Optional) Change marker color or style if needed
      const markerElement = marker.getElement();
      const path = markerElement.querySelector("path[fill='#3FB1CE']");
      if (path) path.setAttribute("fill", "#000000");
    });

    // Resize on parent changes
    const resizeMap = () => {
      if (map) setTimeout(() => map.resize(), 700);
    };
    resizeMap();

    return () => map.remove();
  }, [isLoading, isError, properties, filters.coordinates]);

  if (isLoading) return <>Loading map...</>;
  if (isError) return <div>Failed to load map</div>;

  return (
    <div
      ref={mapContainerRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const { longitude, latitude } = property.location.coordinates;
  const marker = new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `<div class="marker-popup">
           <a href="/search/${property.id}" target="_blank" class="font-semibold text-sm">
             ${property.name}
           </a>
           <p class="text-xs text-gray-700">$${property.pricePerMonth.toLocaleString()} / month</p>
         </div>`
      )
    )
    .addTo(map);
  return marker;
};

export default Map;
