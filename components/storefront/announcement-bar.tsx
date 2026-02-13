import { getGlobalSettings } from "@/app/actions/global-settings";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  href?: string;
}

export async function AnnouncementBar() {
  const settings = (await getGlobalSettings(
    "announcement_bar",
  )) as AnnouncementSettings | null;

  if (!settings || !settings.enabled) return null;

  return (
    <div className="bg-green-600 text-white text-xs font-semibold tracking-wide py-2.5 px-4 text-center relative z-50 overflow-hidden">
      <div className="flex w-full overflow-hidden select-none">
        <div
          className="flex animate-marquee shrink-0 items-center justify-around min-w-full gap-10 pr-10"
          style={{ "--duration": "60s" } as React.CSSProperties}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={`a-${i}`}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {settings.text}
              {settings.href && (
                <Link
                  href={settings.href}
                  className="inline-flex items-center gap-1 underline underline-offset-2 decoration-1 font-bold hover:opacity-80 transition-opacity"
                >
                  Shop Now <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </span>
          ))}
        </div>
        <div
          className="flex animate-marquee shrink-0 items-center justify-around min-w-full gap-10 pr-10"
          aria-hidden="true"
          style={{ "--duration": "60s" } as React.CSSProperties}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={`b-${i}`}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {settings.text}
              {settings.href && (
                <Link
                  href={settings.href}
                  className="inline-flex items-center gap-1 underline underline-offset-2 decoration-1 font-bold hover:opacity-80 transition-opacity"
                >
                  Shop Now <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
