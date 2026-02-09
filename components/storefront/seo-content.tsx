import React from "react";
import { Zap, ShieldCheck, Sparkles } from "lucide-react";

export function SeoContent() {
  return (
    <section className="py-20 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-foreground font-extrabold leading-tight">
            Why fitByte is the ultimate fuel for your life
          </h2>
          <p className="text-muted-foreground font-sans leading-relaxed text-base">
            Discover why health-conscious enthusiasts choose{" "}
            <span className="text-primary font-bold">fitByte</span> for premium
            nutrition and a vibrant, energetic lifestyle.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 transition-all hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 group">
            <div className="h-12 w-12 flex items-center justify-center mb-6 text-primary bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4">
              Purity Guaranteed
            </h3>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              We never compromise. Our products are lab-tested and engineered
              for optimal nutrition, setting a new standard for wellness.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 transition-all hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 group">
            <div className="h-12 w-12 flex items-center justify-center mb-6 text-secondary bg-secondary/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4">
              Clean Ingredients
            </h3>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              Fuel your body with the best. We use pure, wholesome ingredients
              that give you sustained energy without the crash.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 transition-all hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 group">
            <div className="h-12 w-12 flex items-center justify-center mb-6 text-accent bg-accent/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4">
              The fitByte Lifestyle
            </h3>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              Join more than just a brand; join a lifestyle. Vibrant, inclusive,
              and focused on peak performance every single day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
