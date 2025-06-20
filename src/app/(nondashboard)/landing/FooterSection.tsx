// File: src/components/FooterSection.tsx

import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  return (
    <footer className="bg-secondary-300 text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-600">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Support</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/help-center" className="hover:text-primary-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-600">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal</h2>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-primary-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-600">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-600">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h2>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-500 hover:text-primary-600"
              >
                <FontAwesomeIcon icon={faFacebook} className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-500 hover:text-primary-600"
              >
                <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-500 hover:text-primary-600"
              >
                <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-500 hover:text-primary-600"
              >
                <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-500 hover:text-primary-600"
              >
                <FontAwesomeIcon icon={faYoutube} className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Subscribe to our newsletter for updates
            </p>
            <form className="mt-3 flex">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-r-md hover:bg-primary-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MILESHOME. All rights reserved.
          </p>
          <div className="mt-3 md:mt-0 flex space-x-4 text-sm">
            <Link href="=#" className="hover:text-primary-600">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary-600">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary-600">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
