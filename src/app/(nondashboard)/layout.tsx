// File: src/app/layout.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      // 1. If the user is not signed in, redirect to /signin
      if (!authUser) {
        router.push("/signin", { scroll: false });
        return;
      }

      // 2. If a manager is on public pages, send them to their dashboard
      const role = authUser.userRole?.toLowerCase();
      if (
        role === "manager" &&
        (pathname === "/" || pathname.startsWith("/search"))
      ) {
        router.push("/managers/properties", { scroll: false });
        return;
      }

      // 3. Otherwise we’re authenticated and on an allowed page
      setIsReady(true);
    }
  }, [authLoading, authUser, pathname, router]);

  // While auth is loading or redirect logic is pending, show the GUI loader
  if (authLoading || !isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className="h-full flex w-full flex-col"
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
