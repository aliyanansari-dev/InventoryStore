"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { createUser } from "@/lib/actions/user";
import { toast } from "sonner";
import {
  UserPlus,
  ShieldCheck,
  UserCheck,
  Search,
  Loader2,
  Mail,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UsersTableProps {
  initialUsers: any[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "cashier">("cashier");

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createUser({
        name,
        email,
        password,
        role,
      });

      if (!res.success || !res.data) {
        toast.error(res.error || "Failed to create staff member");
        return;
      }

      toast.success(`User "${name}" created successfully as ${role}!`);
      setUsers((prev) => [res.data, ...prev]);
      setIsAddOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("cashier");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#131B2E] p-4 rounded-xl border border-white/[0.08]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name or email..."
            className="pl-10 h-10 bg-[#0A0F1C] border-white/10"
          />
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#131B2E] overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Role & Access Level</TableHead>
              <TableHead>Account Created</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-slate-500">
                  No staff accounts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => {
                const isAdmin = u.role === "admin";
                return (
                  <TableRow key={u._id} className="hover:bg-white/[0.02]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400 sm:hidden">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-300 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        <span>{u.email}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={isAdmin ? "admin" : "cashier"}>
                        {isAdmin ? (
                          <ShieldCheck className="h-3 w-3 mr-1 inline" />
                        ) : (
                          <UserCheck className="h-3 w-3 mr-1 inline" />
                        )}
                        <span className="capitalize">{u.role}</span>
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{formatDate(u.createdAt)}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>
              Create a new user account for an Admin or POS Cashier.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="staff-name">Full Name *</Label>
              <Input
                id="staff-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Smith"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="staff-email">Email Address *</Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@minimart.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="staff-pass">Password *</Label>
              <Input
                id="staff-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="staff-role">Role *</Label>
              <Select
                id="staff-role"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="cashier" className="bg-[#0A0F1C] text-white">
                  Cashier (POS Billing, Inventory View)
                </option>
                <option value="admin" className="bg-[#0A0F1C] text-white">
                  Administrator (Full CRUD & Access)
                </option>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
