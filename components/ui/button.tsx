import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white shadow hover:bg-emerald-500 hover:shadow-emerald-900/30",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500 hover:shadow-red-900/30",
        outline:
          "border border-white/10 bg-transparent hover:bg-white/5 hover:text-white text-slate-200",
        secondary:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-500 hover:shadow-blue-900/30",
        ghost: "hover:bg-white/10 hover:text-white text-slate-300",
        link: "text-emerald-400 underline-offset-4 hover:underline",
        glass:
          "bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
