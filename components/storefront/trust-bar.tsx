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
    <section className="py-10 md:py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h3 className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8 md:mb-10">
          Our Products Are
        </h3>

        {/* Desktop: Static Grid */}
        <div className="hidden md:flex justify-center items-center gap-8 lg:gap-12 flex-wrap max-w-5xl mx-auto">
          {BADGES.map((badge, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 group cursor-default px-4"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                <badge.icon className="h-6 w-6 text-green-600 stroke-[1.5]" />
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight whitespace-nowrap">
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
                <div className="w-12 h-12 flex items-center justify-center bg-green-50 rounded-xl">
                  <badge.icon className="h-5 w-5 text-green-600 stroke-[1.5]" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 text-center whitespace-nowrap">
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
