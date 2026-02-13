import React from "react";
import { Zap, ShieldCheck, Sparkles } from "lucide-react";

export function SeoContent() {
  return (
    <section className="py-24 bg-[#fdfcf0] border-y-2 border-[#1a2b47]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <span className="text-[#e31e24] font-black tracking-[0.3em] uppercase text-xs">
            The FitByte Difference
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#1a2b47] tracking-tighter uppercase leading-[0.85]">
            Why fitByte is the ultimate <br />
            <span className="text-zinc-300">fuel for your life.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-10 rounded-none border-4 border-[#1a2b47] shadow-[10px_10px_0px_0px_rgba(26,43,71,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(227,30,36,1)] group">
            <div className="h-14 w-14 flex items-center justify-center mb-8 border-2 border-[#1a2b47] bg-[#fdfcf0] group-hover:bg-[#1a2b47] transition-all duration-300">
              <ShieldCheck className="h-7 w-7 text-[#e31e24] group-hover:text-white stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-4 text-[#1a2b47]">
              Purity Guaranteed
            </h3>
            <p className="text-sm font-black uppercase text-[#1a2b47]/60 leading-relaxed tracking-tight">
              We never compromise. Our products are lab-tested and engineered
              for optimal nutrition, setting a new standard for wellness.
            </p>
          </div>

          <div className="bg-white p-10 rounded-none border-4 border-[#1a2b47] shadow-[10px_10px_0px_0px_rgba(26,43,71,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(227,30,36,1)] group">
            <div className="h-14 w-14 flex items-center justify-center mb-8 border-2 border-[#1a2b47] bg-[#fdfcf0] group-hover:bg-[#1a2b47] transition-all duration-300">
              <Zap className="h-7 w-7 text-[#e31e24] group-hover:text-white stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-4 text-[#1a2b47]">
              Clean Ingredients
            </h3>
            <p className="text-sm font-black uppercase text-[#1a2b47]/60 leading-relaxed tracking-tight">
              Fuel your body with the best. We use pure, wholesome ingredients
              that give you sustained energy without the crash.
            </p>
          </div>

          <div className="bg-white p-10 rounded-none border-4 border-[#1a2b47] shadow-[10px_10px_0px_0px_rgba(26,43,71,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(227,30,36,1)] group">
            <div className="h-14 w-14 flex items-center justify-center mb-8 border-2 border-[#1a2b47] bg-[#fdfcf0] group-hover:bg-[#1a2b47] transition-all duration-300">
              <Sparkles className="h-7 w-7 text-[#e31e24] group-hover:text-white stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-4 text-[#1a2b47]">
              The fitByte Lifestyle
            </h3>
            <p className="text-sm font-black uppercase text-[#1a2b47]/60 leading-relaxed tracking-tight">
              Join more than just a brand; join a lifestyle. Vibrant, inclusive,
              and focused on peak performance every single day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
