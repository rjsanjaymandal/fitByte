"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => Promise<void>;
  isSubmitting: boolean;
  initialEmail?: string;
}

export function WaitlistDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialEmail = "",
}: WaitlistDialogProps) {
  const [email, setEmail] = useState(initialEmail);

  // Update email state if initialEmail changes
  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
    if (!email) setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-100 bg-white p-8">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
            <Bell className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-extrabold text-slate-900 text-center tracking-tight">
            Get Notified
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-center text-slate-500 max-w-[280px] mx-auto">
            We&apos;ll ping you the second this item is back in stock. No spam,
            just the good stuff.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label
              htmlFor="email"
              className="text-[11px] uppercase tracking-wider font-bold text-slate-400"
            >
              Email Address (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              className="rounded-2xl border-rose-100 bg-stone-50 focus:border-rose-400 focus:ring-rose-400/10 transition-all h-14 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-stone-900 text-white rounded-2xl text-base font-bold hover:bg-stone-800 transition-all shadow-lg shadow-rose-100 active:scale-[0.98]"
            >
              {isSubmitting ? "Joining..." : "Notify Me"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
