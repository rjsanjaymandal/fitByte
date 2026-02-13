"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/app/actions/marketing-actions";
import { toast } from "sonner";
import { Send } from "lucide-react";

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
    <section className="py-16 md:py-24 bg-[#fdfcf0] border-t border-[#1a2b47]/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-[#1a2b47] uppercase tracking-tighter mb-4">
            Join the fitByte Fam
          </h2>
          <p className="text-sm text-[#1a2b47]/60 font-medium mb-10 max-w-md mx-auto leading-relaxed">
            Subscribe to our newsletter for the latest updates on new products,
            exclusive promotions, and discounts.
          </p>

          <form action={action} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  autoComplete="email"
                  placeholder="YOUR EMAIL ADDRESS"
                  required
                  className="h-14 w-full rounded-none border-2 border-[#1a2b47] bg-white px-5 text-xs font-bold uppercase tracking-widest placeholder:text-zinc-300 focus-visible:ring-0 focus:border-[#e31e24] transition-colors"
                />
              </div>
              <Button
                type="submit"
                className="h-14 rounded-none bg-[#e31e24] hover:bg-[#1a2b47] text-white px-8 text-xs font-black uppercase tracking-widest transition-colors shrink-0"
              >
                <span>Subscribe</span>
                <Send className="h-4 w-4 ml-2 stroke-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
