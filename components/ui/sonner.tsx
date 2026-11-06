"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#131B2E] group-[.toaster]:text-slate-100 group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl font-sans",
          description: "group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-emerald-600 group-[.toast]:text-white font-medium",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-slate-300",
          success: "group-[.toaster]:border-emerald-500/30 group-[.toaster]:text-emerald-400",
          error: "group-[.toaster]:border-red-500/30 group-[.toaster]:text-red-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
