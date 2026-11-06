import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/actions/user";
import { Header } from "@/components/shared/header";
import { UsersTable } from "@/components/users/users-table";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Admin access guard
  if (session.user?.role !== "admin") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Access Restricted" />
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-md">
            You are logged in as a <strong>Cashier</strong>. Staff user management is restricted to Administrators only.
          </p>
          <Link href="/dashboard" className="mt-6">
            <Button variant="outline">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const res = await getUsers();
  const users = res.success ? res.data : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="User & Staff Management"
        description="Configure POS Cashiers, Store Managers, and System Administrators"
      />

      <div className="p-8">
        <UsersTable initialUsers={users} />
      </div>
    </div>
  );
}
