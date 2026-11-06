import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        destructive:
          "border-transparent bg-red-500/15 text-red-400 border border-red-500/30",
        warning:
          "border-transparent bg-amber-500/15 text-amber-400 border border-amber-500/30",
        secondary:
          "border-transparent bg-blue-500/15 text-blue-400 border border-blue-500/30",
        outline:
          "text-slate-300 border border-white/10 bg-white/5",
        admin:
          "bg-purple-500/15 text-purple-400 border border-purple-500/30",
        cashier:
          "bg-blue-500/15 text-blue-400 border border-blue-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
