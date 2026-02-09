"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/app/actions/marketing-actions";
import { toast } from "sonner";
import { Send } from "lucide-react";
import FlashImage from "@/components/ui/flash-image";

export function NewsletterSection() {
  async function action(formData: FormData) {
    const res = await subscribeToNewsletter(formData);
    if (res?.error) {
      toast.error(res.error);
    } else {
      if (res?.message) {
        toast.info(res.message);
      } else {
        toast.success("Subscribed successfully!");
      }
    }
  }

  return (
    <section className="relative overflow-hidden bg-primary/5 py-16 sm:py-24 border-t border-primary/10">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-background border border-primary/10 rounded-[2.5rem] shadow-xl shadow-primary/5 overflow-hidden md:grid md:grid-cols-2 md:items-center relative group">
          <div className="p-8 sm:p-12 lg:p-16 relative z-10">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl sm:text-5xl font-serif text-foreground font-extrabold leading-tight">
                Fuel Your <br />
                <span className="text-primary italic">Inbox</span>
              </h2>

              <p className="mt-4 text-muted-foreground leading-relaxed font-sans text-base">
                Join the fitByte community for exclusive health tips, product
                drops, and
                <span className="text-primary font-bold"> 10% OFF </span> on
                your first order.
              </p>

              <form action={action} className="mt-8">
                <div className="relative flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <label htmlFor="email" className="sr-only">
                      {" "}
                      Email Address{" "}
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      required
                      className="h-14 w-full rounded-2xl border-primary/10 bg-white px-6 text-sm transition-colors focus:border-primary/30 focus:ring-primary/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-14 group rounded-2xl bg-primary text-white px-10 text-sm font-bold uppercase tracking-wider transition hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    <span>Get 10% Off</span>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 bg-muted overflow-hidden">
            <FlashImage
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop"
              alt="Healthy lifestyle nutrition"
              fill
              className="object-cover opacity-90 transition hover:opacity-100 duration-700 mix-blend-overlay group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
