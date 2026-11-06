"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Store,
  Lock,
  Mail,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Barcode,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!res?.ok || res?.error) {
        toast.error(res?.error || "Invalid credentials. Please verify your email and password.");
        setIsLoading(false);
        return;
      }

      toast.success("Login successful! Welcome back.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during sign in.");
      setIsLoading(false);
    }
  };

  const fillCredentials = (role: "admin" | "cashier") => {
    if (role === "admin") {
      setValue("email", "admin@minimart.com", { shouldValidate: true });
      setValue("password", "admin123", { shouldValidate: true });
      toast.info("Filled Admin credentials (admin@minimart.com / admin123)");
    } else {
      setValue("email", "cashier@minimart.com", { shouldValidate: true });
      setValue("password", "cashier123", { shouldValidate: true });
      toast.info("Filled Cashier credentials (cashier@minimart.com / cashier123)");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0A0F1C] text-slate-100 overflow-hidden relative">
      {/* Background radial gradient glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Split Screen Left Side: Brand & Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative border-r border-white/[0.06] bg-gradient-to-br from-[#0c1427]/80 via-[#0A0F1C] to-[#0A0F1C]">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-900/40">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              MiniMart <span className="text-emerald-400 font-mono text-xs">POS</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Enterprise Retail Suite</p>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="space-y-6 max-w-md my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Zap className="h-3.5 w-3.5" /> High Velocity Point of Sale
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Streamlined Inventory & <span className="text-emerald-400">Smart Billing</span> for Retail.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Experience sub-second barcode checkout, automated stock alerts, real-time sales analytics, and role-based staff management in one unified dashboard.
          </p>

          {/* Feature Highlights Bento List */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1">
              <div className="text-emerald-400 flex items-center gap-1.5 text-xs font-bold">
                <Barcode className="h-4 w-4" /> Barcode POS
              </div>
              <p className="text-[11px] text-slate-400">
                Instant SKU scanning & live inventory deduction
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1">
              <div className="text-blue-400 flex items-center gap-1.5 text-xs font-bold">
                <ShieldCheck className="h-4 w-4" /> Role Security
              </div>
              <p className="text-[11px] text-slate-400">
                Admin full access & Cashier billing privileges
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>Production Ready v1.0</span>
          <span>Secured with NextAuth & JWT</span>
        </div>
      </div>

      {/* Split Screen Right Side: Glassmorphic Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile brand header (visible on < lg) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              MiniMart <span className="text-emerald-400 font-mono text-xs">POS</span>
            </h1>
          </div>

          {/* Glassmorphic Card Container */}
          <div className="rounded-2xl border border-white/10 bg-[#131B2E]/90 backdrop-blur-xl p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Staff Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to access the POS terminal & inventory
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@minimart.com"
                    className="pl-10 h-11 bg-[#0A0F1C]/80 border-white/10 text-white"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 bg-[#0A0F1C]/80 border-white/10 text-white"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Terminal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Credentials Fill Buttons */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
                Demo Quick Fill
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillCredentials("admin")}
                  className="h-9 text-xs border-white/10 hover:bg-white/5 text-slate-200"
                >
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                  Fill Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillCredentials("cashier")}
                  className="h-9 text-xs border-white/10 hover:bg-white/5 text-slate-200"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                  Fill Cashier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
