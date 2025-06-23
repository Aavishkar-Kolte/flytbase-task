"use client";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex">
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
} 