"use client";

import React from "react";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import FooterSection from "../landing/FooterSection";
import { motion } from "framer-motion";

const supportOptions = [
  {
    id: 1,
    title: "Live Chat",
    description: "Instant answers from our Austrian real estate experts.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M12 2C6.48 2 2 5.58 2 10C2 12.21 3.01 14.21 4.67 15.67L4 22L10.33 20.5C11.39 20.77 12.49 20.9 13.58 20.9C18.52 20.9 22 17.32 22 12.9C22 8.48 18.52 5 13.58 5C12.41 5 11.27 5.15 10.18 5.43C9.96 5.49 9.74 5.45 9.57 5.28C8.43 4.12 7.03 3.16 5.45 2.46C6.63 2.16 7.85 2 9.08 2H12Z"
          fill="currentColor"
        />
      </svg>
    ),
    link: "/chat",
  },
  {
    id: 2,
    title: "Email Us",
    description: "Send us an email and we’ll respond within 24 hours.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
          fill="currentColor"
        />
      </svg>
    ),
    link: "mailto:info@milestonerealestate.at",
  },
  {
    id: 3,
    title: "Call Us",
    description: "+14402699164",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.61 14.98 15.89 14.93 16.15 14.99C17.19 15.23 18.27 15.36 19.38 15.36C19.72 15.36 20 15.64 20 15.98V20.03C20 20.37 19.72 20.65 19.38 20.65C10.07 20.65 2 12.58 2 3.27C2 2.93 2.28 2.65 2.62 2.65H6.67C7.01 2.65 7.29 2.93 7.29 3.27C7.29 4.38 7.42 5.46 7.66 6.5C7.72 6.76 7.67 7.04 7.47 7.24L5.27 9.44C5.19 9.52 5.14 9.61 5.11 9.71C5.1 9.74 5.1 9.78 5.1 9.81C5.1 10.05 5.28 10.26 5.5 10.31L6.62 10.79Z"
          fill="currentColor"
        />
      </svg>
    ),
    link: "https://wa.me/14402699164?text=Hello%20I%20want%20to%20know%20more%20about%20MilesHome%20real%20estate%20services",
  },
];

const investorTestimonials = [
  {
    id: 1,
    name: "Thomas Berger",
    position: "Investor",
    quote:
      "Miles Home Real Estate guided me through a seamless investment process and secured a high-yield property in Vienna. Highly recommended!",
  },
  {
    id: 2,
    name: "Martin Schmidt",
    position: "Investor",
    quote:
      "Their market analysis and negotiation skills yielded above-average returns within one year.",
  },
  {
    id: 3,
    name: "Elena Fischer",
    position: "Property Owner",
    quote:
      "Thanks to Miles Home, I found the perfect tenant and my rental income has never been higher.",
  },
  {
    id: 4,
    name: "Lukas Weber",
    position: "Long-term Investor",
    quote:
      "Their aftercare service truly stands out — they manage everything so I can enjoy passive income stress-free.",
  },
];


const teamMembers = [
  {
    id: 1,
    name: "Jason Graeme",
    role: "Chief Executive Officer",
    imageSrc: "/1.jpg",
  },
  {
    id: 2,
    name: "Arthur E. Allen",
    role: "Chief Financial Officer, Partner",
    imageSrc: "/2.jpg",
  },
  {
    id: 3,
    name: "Matthew Bradwell",
    role: "Chief Acquisitions Officer, Partner",
    imageSrc: "/3.jpg",
  },
  {
    id: 4,
    name: "Samuel Jonathan",
    role: "Senior Minerals Specialist",
    imageSrc: "/4.jpg",
  },
  {
    id: 5,
    name: "Corey C. Eddins",
    role: "Senior Associate, Capital Markets",
    imageSrc: "/5.jpg",
  },
  {
    id: 6,
    name: "Karla Velasquez",
    role: "Manager, Investor Relations",
    imageSrc: "/6.jpg",
  },
  {
    id: 7,
    name: "Kathleen Cohen",
    role: "Revenue Accounting Specialist",
    imageSrc: "/7.jpg",
  },
  {
    id: 8,
    name: "Jack Gonzales",
    role: "Software Engineer",
    imageSrc: "/8.jpg",
  },
];

export default function AboutPage() {
   const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Contact Cards at Top */}
      <section className="bg-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {supportOptions.map((option) => (
            <a
              key={option.id}
              href={option.link}
              className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-300 mb-3">
                {option.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">
                {option.title}
              </h4>
              <p className="text-gray-600 text-center text-sm">
                {option.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Header with Video Background */}
      <header className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
            Miles Home Real Estate
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="site-section section-main py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="row">
            <div className="container mx-auto px-4">
              {/* New Investment Journey Introduction */}
              <div className="col-12 pt-4 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Welcome to Mileshome Real Estate, where your investment
                  journey begins! At Mileshome, we understand that investing in
                  real estate is not just about purchasing property; it’s about
                  building wealth, generating passive income, and securing a
                  financial future. Our mission is to provide you with the
                  tools, resources, and expertise necessary to make informed
                  decisions that will benefit your investment portfolio.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  At Mileshome, we specialize in connecting investors with
                  lucrative real estate opportunities. Our team of experienced
                  professionals is dedicated to identifying and acquiring
                  properties that have the potential for significant
                  appreciation and cash flow. We take the time to analyze market
                  trends, evaluate property values, and assess rental demand,
                  ensuring that our investors are presented with the best
                  possible options.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  One of the key ways Mileshome generates money for our
                  investors is through strategic property acquisitions. We focus
                  on markets that show strong growth potential, allowing us to
                  purchase properties at competitive prices. This strategic
                  approach not only maximizes the return on investment but also
                  minimizes risk. By investing in properties with solid
                  fundamentals, we can ensure that our investors see a steady
                  increase in property value over time.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  In addition to property acquisitions, Mileshome also offers
                  property management services that enhance the profitability of
                  your investment. Our team is skilled in managing rental
                  properties, ensuring that they are well-maintained and
                  occupied by quality tenants. We handle everything from
                  marketing the property and screening tenants to handling
                  maintenance requests and collecting rent. This comprehensive
                  management approach allows our investors to enjoy passive
                  income without the stress of day-to-day operations.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  Furthermore, we understand the importance of diversification
                  in an investment portfolio. Mileshome offers a variety of real
                  estate options, from residential properties to commercial
                  spaces, allowing investors to spread their risk across
                  different asset classes. This diversification not only
                  protects your investment but also opens up new avenues for
                  revenue generation.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  At Mileshome, we also provide valuable insights and education
                  to our investors. We believe that informed investors make the
                  best decisions. Our website features a wealth of resources,
                  including market reports, investment guides, and expert
                  articles, all designed to help you navigate the real estate
                  landscape with confidence. We host regular webinars and
                  workshops, where our team shares their knowledge and
                  experience, empowering you to make strategic investment
                  choices.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  Moreover, our commitment to transparency and communication
                  sets us apart. At Mileshome, we believe that building trust is
                  essential for a successful partnership. We provide regular
                  updates on your investments, including performance reports and
                  market analysis, ensuring that you are always informed about
                  the status of your portfolio. Our team is always available to
                  answer any questions or address any concerns you may have,
                  fostering a collaborative relationship that prioritizes your
                  success.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  As you embark on your investment journey with Mileshome, you
                  will also benefit from our extensive network of industry
                  connections. We collaborate with lenders, contractors, and
                  real estate professionals to ensure that you have access to
                  the best resources available. Whether you need financing
                  options or renovation services, our network is here to support
                  you every step of the way.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  In conclusion, Mileshome Real Estate is your partner in
                  building a successful investment portfolio. With our strategic
                  property acquisitions, comprehensive property management
                  services, educational resources, and commitment to
                  transparency, we are dedicated to helping you achieve your
                  financial goals. Join us today and discover how Mileshome can
                  help you generate wealth through real estate investment.
                  Welcome to a brighter financial future!
                </p>
              </div>
              <div className="col-12 mb-12">
                <div className="w-full rounded-2xl overflow-hidden">
                  <iframe
                    className="w-full h-[600px] rounded-2xl"
                    src="/video-i1.mp4"
                    title="Miles Home Real Estate Overview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            <SectionTitle
              title="Our Property Acquisition Process"
              paragraph="We guide you through every step to secure your ideal property in Austria. Here’s how:"
              mb="32px"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="featured-box bg-white rounded-2xl p-6 shadow">
                <div className="mb-4 text-red-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
                    />
                  </svg>
                </div>
                <h5 className="text-xl font-semibold mb-2">
                  1. Initial Consultation & Needs Assessment
                </h5>
                <p className="text-gray-600">
                  We start with a detailed conversation to understand your
                  budget, preferred neighborhoods, and property goals.
                </p>
              </div>
              <div className="featured-box bg-white rounded-2xl p-6 shadow">
                <div className="mb-4 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
                    />
                  </svg>
                </div>
                <h5 className="text-xl font-semibold mb-2">
                  2. Property Search & Viewings
                </h5>
                <p className="text-gray-600">
                  We curate a selection of properties matching your criteria and
                  coordinate viewings—from Vienna’s historic districts to
                  Salzburg’s scenic locations.
                </p>
              </div>
              <div className="featured-box bg-white rounded-2xl p-6 shadow">
                <div className="mb-4 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
                    />
                  </svg>
                </div>
                <h5 className="text-xl font-semibold mb-2">
                  3. Negotiation & Financing
                </h5>
                <p className="text-gray-600">
                  Our experts negotiate the best price and connect you with
                  local lenders for competitive Austrian mortgage options.
                </p>
              </div>
              <div className="featured-box bg-white rounded-2xl p-6 shadow">
                <div className="mb-4 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
                    />
                  </svg>
                </div>
                <h5 className="text-xl font-semibold mb-2">
                  4. Closing & Aftercare
                </h5>
                <p className="text-gray-600">
                  We handle all closing procedures and offer post-sale support,
                  including property management and rental services.
                </p>
              </div>
            </div>

            <SectionTitle
              title="Why Choose Miles Home Real Estate?"
              paragraph=""
              mb="32px"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="featured-box bg-white rounded-2xl p-6 shadow">
                <h5 className="text-xl font-semibold mb-2">
                  Local Expertise & Market Insight
                </h5>
                <p className="text-gray-600">
                  Over a decade of experience in Vienna’s dynamic real estate
                  market ensures you find the best opportunities.
                </p>
              </div>
              <div className="featured-box bg-white rounded-2xl p-6 shadow">
                <h5 className="text-xl font-semibold mb-2">
                  Personalized Service
                </h5>
                <p className="text-gray-600">
                  We tailor our approach to each client’s needs—whether buying,
                  selling, or renting in Austria.
                </p>
              </div>
              <div className="featured-box bg-white rounded-2xl p-6 shadow">
                <h5 className="text-xl font-semibold mb-2">
                  Streamlined Transactions
                </h5>
                <p className="text-gray-600">
                  From property selection to legal closing, we manage every step
                  for a hassle-free experience.
                </p>
              </div>
              <div className="featured-box bg-white rounded-2xl p-6 shadow">
                <h5 className="text-xl font-semibold mb-2">
                  Post-Sale & Rental Support
                </h5>
                <p className="text-gray-600">
                  Our aftercare includes property management, renovations, and
                  tenant placement services for ongoing peace of mind.
                </p>
              </div>
            </div>

            <SectionTitle
              title="Meet Our Team"
              paragraph="Introducing the leadership and consultants behind Miles Home Real Estate."
              mb="32px"
            />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="relative h-32 w-32 mb-4 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={member.imageSrc}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 text-center uppercase text-sm">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>

            <SectionTitle title="Our Mission" paragraph="" mb="32px" />
            <div className="site-section section-team dotted-pattern pt-8 pb-16 bg-gray-50 mb-16">
              <div className="container mx-auto px-4">
                <p className="text-gray-700 leading-relaxed">
                  At Miles Home Real Estate, our mission is to provide
                  exceptional real estate services across Austria by combining
                  local market expertise, innovative technology, and
                  personalized attention. We strive to become the most trusted
                  partner for homeowners, investors, and tenants, fostering
                  sustainable communities through strategic property solutions.
                  <br />
                  <br />
                  We believe in transparency, integrity, and long-term
                  relationships. Our goal is not only to help you find or sell a
                  property but to create lasting value and satisfaction for
                  every client we serve.
                </p>
              </div>
            </div>

            <SectionTitle
              title="Investor Testimonials"
              paragraph="Hear from those who have partnered with Miles Home Real Estate."
              mb="32px"
            />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {investorTestimonials.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <p className="text-gray-800 italic mb-4">“{item.quote}”</p>
                  <p className="text-gray-900 font-semibold mb-1">
                    {item.name}
                  </p>
                  <p className="text-gray-600 text-sm">{item.position}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
