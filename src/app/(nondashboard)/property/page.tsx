"use client";

import React from "react";
import { motion } from "framer-motion";
import Listings from "../search/Listings";
import Map from "../search/Map";
import FooterSection from "../landing/FooterSection";

const PropertyFeaturesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/*–––––– Main Scrollable Content ––––––*/}
      <main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Featured Properties
          </h1>
          <p className="text-lg text-gray-600">
            Explore our curated list of handpicked properties. Find your next
            home with breathtaking views and premium amenities.
          </p>
        </motion.div>

        {/* Main Content: Listings & Map */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Listings — limit to 6 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:basis-7/12 bg-white rounded-2xl shadow-lg p-6"
          >
            <Listings limit={6} />
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:basis-5/12 bg-white rounded-2xl shadow-lg p-6 h-[600px] relative"
          >
            {/* 
              “relative” allows the inner div in Map.tsx to fill 100% height 
            */}
            <Map />
          </motion.div>
        </div>

        {/* Write-up / Blog Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6 mb-16"
        >
          <h2 className="text-2xl font-semibold text-gray-900">
            Insights & Tips for Home Hunters
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Navigating the real estate market can be overwhelming. Whether you’re
            a first-time buyer or looking to upgrade, our blog offers expert tips
            on everything from negotiating the best price to identifying
            neighborhoods with high growth potential. Dive into our latest posts
            for in-depth guides, market analyses, and success stories from
            satisfied homeowners.
          </p>
          <div className="space-y-4">
            <article className="border-l-4 border-primary-700 pl-4">
              <h3 className="text-xl font-medium text-gray-800">
                How to Spot a High-ROI Neighborhood
              </h3>
              <p className="text-gray-600">
                Learn the key indicators of a neighborhood on the rise—from new
                infrastructure projects to local business growth—and position
                yourself for maximum return on investment.
              </p>
            </article>
            <article className="border-l-4 border-primary-700 pl-4">
              <h3 className="text-xl font-medium text-gray-800">
                5 Red Flags When Touring a Property
              </h3>
              <p className="text-gray-600">
                Before you sign that contract, make sure you aren’t overlooking
                these common issues. From foundation cracks to plumbing problems,
                we’ve got you covered.
              </p>
            </article>
            <article className="border-l-4 border-primary-700 pl-4">
              <h3 className="text-xl font-medium text-gray-800">
                Financing Options for Every Budget
              </h3>
              <p className="text-gray-600">
                Mortgage rates, down payments, FHA vs. conventional loans—discover
                the best financing routes tailored to your unique financial
                situation.
              </p>
            </article>
          </div>
        </motion.div>
      </main>

      {/*–––––– Footer ––––––*/}
      <FooterSection />
    </div>
  );
};

export default PropertyFeaturesPage;
