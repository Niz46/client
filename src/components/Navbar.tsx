// File: src/components/Navbar.tsx
"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  useGetAuthUserQuery,
  useGetUserMessagesQuery,
  useGetUserAlertsQuery,
} from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search, Menu, X } from "lucide-react";
import { toast } from "sonner";
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

  // Base CSS for dropdown items
  const itemClass = "text-sm px-4 py-2 hover:bg-gray-100 cursor-pointer";

  // Only show sidebar toggle on dashboard pages
  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  // Fetch in-app messages & alerts, polling every 30 seconds
  const { data: messages = [], isLoading: msgsLoading } =
    useGetUserMessagesQuery(undefined, {
      skip: !authUser,
      pollingInterval: 30000,
    });
  const { data: alerts = [], isLoading: alertsLoading } =
    useGetUserAlertsQuery(undefined, {
      skip: !authUser,
      pollingInterval: 30000,
    });

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const handleMessagesClick = () => {
    if (msgsLoading) {
      toast.loading("Loading messages…");
      return;
    }
    if (!messages.length) {
      toast("No new messages");
      return;
    }
    toast(
      <>
        <div className="font-semibold mb-1">Messages</div>
        {messages.map((m) => (
          <div key={m.id} className="text-sm mb-1">
            {m.text}
          </div>
        ))}
      </>,
      { duration: 8000 }
    );
  };

  const handleAlertsClick = () => {
    if (alertsLoading) {
      toast("Loading notifications…");
      return;
    }
    if (!alerts.length) {
      toast("No new notifications");
      return;
    }
    toast(
      <>
        <div className="font-semibold mb-1">Notifications</div>
        {alerts.map((a) => (
          <div key={a.id} className="text-sm mb-1">
            {a.text}
          </div>
        ))}
      </>,
      { duration: 8000 }
    );
  };

  const navLinks = (
    <>
      <Link
        href="/"
        onClick={() => setMobileMenuOpen(false)}
        className="block px-4 py-2 font-medium text-primary-100 hover:text-primary-300"
      >
        Home
      </Link>
      <Link
        href="/about"
        onClick={() => setMobileMenuOpen(false)}
        className="block px-4 py-2 font-medium text-primary-100 hover:text-primary-300"
      >
        About
      </Link>
      <Link
        href="/property"
        onClick={() => setMobileMenuOpen(false)}
        className="block px-4 py-2 font-medium text-primary-100 hover:text-primary-300"
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
        {/* LEFT */}
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            scroll={false}
            className="flex items-center gap-3 hover:text-primary-300"
          >
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
                  <span className="ml-2 hidden md:inline">
                    Add New Property
                  </span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="ml-2 hidden md:inline">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* CENTER */}
        {!isDashboardPage && (
          <nav className="hidden md:flex flex-1 justify-center gap-8">
            {navLinks}
          </nav>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-5 ml-auto">
          {!isDashboardPage && (
            <button
              className="block md:hidden p-2"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}

          {authUser ? (
            <>
              {/* Messages Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="relative hidden md:block">
                  <MessageCircle className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                  {messages.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white text-gray-900 shadow-lg">
                  <div className="px-4 py-2 font-semibold">Messages</div>
                  <hr />
                  {msgsLoading ? (
                    <div className={itemClass}>Loading…</div>
                  ) : messages.length ? (
                    messages.map((m) => (
                      <DropdownMenuItem key={m.id} className={itemClass}>
                        {m.text}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className={itemClass}>No new messages</div>
                  )}
                  <hr />
                  <DropdownMenuItem
                    className={itemClass}
                    onClick={handleMessagesClick}
                  >
                    Show messages in toast
                  </DropdownMenuItem>
                  <hr />
                  <DropdownMenuItem
                    className={`${itemClass} text-center text-sm text-primary-600`}
                    onClick={() => router.push("/messages/history")}
                  >
                    View all
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="relative hidden md:block">
                  <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                  {alerts.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white text-gray-900 shadow-lg">
                  <div className="px-4 py-2 font-semibold">Notifications</div>
                  <hr />
                  {alertsLoading ? (
                    <div className={itemClass}>Loading…</div>
                  ) : alerts.length ? (
                    alerts.map((a) => (
                      <DropdownMenuItem key={a.id} className={itemClass}>
                        {a.text}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className={itemClass}>No new notifications</div>
                  )}
                  <hr />
                  <DropdownMenuItem
                    className={itemClass}
                    onClick={handleAlertsClick}
                  >
                    Show notifications in toast
                  </DropdownMenuItem>
                  <hr />
                  <DropdownMenuItem
                    className={`${itemClass} text-center text-sm text-primary-600`}
                    onClick={() => router.push("/notifications/history")}
                  >
                    View all
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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

      {/* MOBILE NAV */}
      {!isDashboardPage && mobileMenuOpen && (
        <nav className="md:hidden bg-primary-700 text-white border-t border-primary-600">
          <div className="flex flex-col px-4 py-2 space-y-1">{navLinks}</div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
