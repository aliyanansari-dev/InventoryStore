"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  Users,
  LogOut,
  Store,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "cashier";

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "cashier"],
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: Package,
      roles: ["admin", "cashier"],
    },
    {
      name: "POS Terminal",
      href: "/pos",
      icon: ShoppingCart,
      roles: ["admin", "cashier"],
    },
    {
      name: "Sales History",
      href: "/sales",
      icon: History,
      roles: ["admin", "cashier"],
    },
    {
      name: "Users & Staff",
      href: "/users",
      icon: Users,
      roles: ["admin"], // Admin only
    },
  ];

  const allowedNav = navigation.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/[0.08] bg-[#0d1424] flex flex-col justify-between h-screen sticky top-0">
      {/* Brand & Store Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-white/[0.08] gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none">
              MiniMart <span className="text-emerald-400 font-mono text-xs">POS</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-1">Smart Retail Hub</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Main Navigation
          </p>
          {allowedNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout bottom section */}
      <div className="p-4 border-t border-white/[0.08]">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {session?.user?.name || "Logged In User"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {session?.user?.email || "user@minimart.com"}
                </p>
              </div>
            </div>
            <Badge
              variant={userRole === "admin" ? "admin" : "cashier"}
              className="text-[10px] uppercase font-bold px-1.5 py-0"
            >
              {userRole === "admin" ? (
                <ShieldCheck className="h-3 w-3 mr-0.5 inline" />
              ) : (
                <UserCheck className="h-3 w-3 mr-0.5 inline" />
              )}
              {userRole}
            </Badge>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
