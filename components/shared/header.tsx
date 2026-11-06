"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ title, description }: { title: string; description?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 px-8 border-b border-white/[0.08] bg-[#0A0F1C]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{title}</h2>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* System Online Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          POS Terminal Online
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-white/10 hover:bg-white/10 h-9 w-9 text-slate-300"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Dark / Light Mode"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 transition-transform rotate-0" />
          ) : (
            <Sun className="h-4 w-4 transition-transform rotate-0" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
