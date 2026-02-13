"use client";

import {
  Dumbbell,
  Leaf,
  Apple,
  Heart,
  Wheat,
  FlaskConical,
} from "lucide-react";
import dynamic from "next/dynamic";

const Marquee = dynamic(() => import("react-fast-marquee"), { ssr: false });

const BADGES = [
  { icon: Dumbbell, label: "Packed with Protein" },
  { icon: Leaf, label: "GMO Free" },
  { icon: Apple, label: "Low Sugar" },
  { icon: Heart, label: "Gut Friendly" },
  { icon: Wheat, label: "High in Fibre" },
  { icon: FlaskConical, label: "Backed by Science" },
];

export function TrustBar() {
  return (
    <section className="py-10 md:py-14 bg-white border-y border-[#1a2b47]/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#1a2b47]/40 mb-8 md:mb-10">
          Our Products Are
        </h3>

        {/* Desktop: Static Grid */}
        <div className="hidden md:flex justify-center items-center gap-6 lg:gap-10 flex-wrap max-w-5xl mx-auto">
          {BADGES.map((badge, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 group cursor-default px-4"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-[#fdfcf0] border-2 border-[#1a2b47]/10 group-hover:border-[#e31e24] group-hover:bg-[#e31e24]/5 transition-all duration-300">
                <badge.icon className="h-7 w-7 text-[#1a2b47] group-hover:text-[#e31e24] stroke-[1.5] transition-colors" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#1a2b47] text-center leading-tight whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile: Marquee */}
        <div className="md:hidden">
          <Marquee gradient={false} speed={35} className="overflow-y-hidden">
            {BADGES.map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-3 mx-8">
                <div className="w-14 h-14 flex items-center justify-center bg-[#fdfcf0] border-2 border-[#1a2b47]/10">
                  <badge.icon className="h-6 w-6 text-[#1a2b47] stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1a2b47] text-center whitespace-nowrap">
                  {badge.label}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
