// File: src/components/Navbar.tsx
"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar: React.FC = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Treat URLs containing "/managers" or "/tenants" as dashboard pages
  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const navLinks = (
    <>
      <Link
        href="/"
        className="block px-4 py-2 font-medium text-primary-100 hover:text-primary-300"
        onClick={() => setMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        href="/about"
        className="block px-4 py-2 font-medium text-primary-100 hover:text-primary-300"
        onClick={() => setMobileMenuOpen(false)}
      >
        About
      </Link>
      <Link
        href="/property"
        className="block px-4 py-2 font-medium text-primary-100 hover:text-primary-300"
        onClick={() => setMobileMenuOpen(false)}
      >
        Properties
      </Link>
    </>
  );

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 shadow-xl bg-primary-700 text-white"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex items-center h-full px-4 md:px-8">
        {/* ─── LEFT SECTION ─── */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Sidebar toggle (mobile) only on dashboard pages */}
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:text-primary-300" scroll={false}>
            <Image
              src="/logo.svg"
              alt="Miles Home Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <div className="text-xl font-bold">
              MILES
              <span className="text-secondary-500 font-light hover:text-primary-300">
                HOME
              </span>
            </div>
          </Link>

          {/* “Add New Property” / “Search Properties” */}
          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className="ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
              onClick={() =>
                router.push(
                  authUser.userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search"
                )
              }
            >
              {authUser.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="ml-2 hidden md:inline">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="ml-2 hidden md:inline">Search Properties</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* ─── CENTER SECTION (desktop nav) ─── */}
        {!isDashboardPage && (
          <nav className="hidden md:flex flex-1 justify-center gap-8">
            {navLinks}
          </nav>
        )}

        {/* ─── RIGHT SECTION ─── */}
        <div className="flex items-center gap-5 ml-auto">
          {/* Mobile menu toggle (only on public pages) */}
          {!isDashboardPage && (
            <button
              className="block md:hidden p-2"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}

          {authUser ? (
            <>
              {/* Messages & Notifications (desktop only) */}
              <div className="relative hidden md:block">
                <MessageCircle className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full" />
              </div>
              <div className="relative hidden md:block">
                <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full" />
              </div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                  <Avatar>
                    <AvatarImage src={authUser.userInfo?.image} />
                    <AvatarFallback className="bg-primary-600">
                      {authUser.userRole?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-primary-200 hidden md:block">
                    {authUser.userInfo?.name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-primary-700">
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-primary-700 hover:text-primary-100 font-bold"
                    onClick={() =>
                      router.push(
                        authUser.userRole?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites",
                        { scroll: false }
                      )
                    }
                  >
                    Go to Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary-200" />
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-primary-700 hover:text-primary-100"
                    onClick={() =>
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                        { scroll: false }
                      )
                    }
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-primary-700 hover:text-primary-100"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ─── MOBILE NAVIGATION (only on public pages) ─── */}
      {!isDashboardPage && mobileMenuOpen && (
        <nav className="md:hidden bg-primary-700 text-white border-t border-primary-600">
          <div className="flex flex-col px-4 py-2 space-y-1">
            {navLinks}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
