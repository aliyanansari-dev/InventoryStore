import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral" | "danger";
  accentColor?: "emerald" | "blue" | "red" | "purple";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = "neutral",
  accentColor = "emerald",
}: StatCardProps) {
  const accentStyles = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "hover:border-emerald-500/40",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      glow: "hover:border-blue-500/40",
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      glow: "hover:border-red-500/40",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      glow: "hover:border-purple-500/40",
    },
  }[accentColor];

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] border-white/[0.08]",
        accentStyles.glow
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mt-2">
              {value}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                {trend && (
                  <span
                    className={cn(
                      "font-semibold",
                      trendType === "positive" && "text-emerald-400",
                      trendType === "danger" && "text-red-400 font-bold",
                      trendType === "negative" && "text-amber-400"
                    )}
                  >
                    {trend}
                  </span>
                )}
                <span>{subtitle}</span>
              </p>
            )}
          </div>

          <div
            className={cn(
              "h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 shadow-inner",
              accentStyles.bg,
              accentStyles.border,
              accentStyles.text
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
