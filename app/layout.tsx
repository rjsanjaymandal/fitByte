import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { WebSiteJsonLd } from "@/components/seo/website-json-ld";
import { getUnifiedAuth } from "@/lib/supabase/auth-helper";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PWARegister } from "@/components/pwa-register"; // Imported PWA Register

// Fonts are now loaded via CSS @import in globals.css to bypass build-time fetch restrictions
const fontSans = { variable: "--font-sans" };
const fontSerif = { variable: "--font-serif" };
const fontMono = { variable: "--font-mono" };

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Improved for accessibility
  userScalable: true, // Improved for accessibility/SEO
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "fitByte | Premium Health & Bio-Nutrition Essentials",
    template: "%s | fitByte",
  },
  description:
    "Explore fitByte - India's premier bio-nutrition label. Optimized health meeting high-performance bio-hacking. Discover our collection of premium supplements, plant-based nutrition, and energy essentials.",
  keywords: [
    "health supplements brand",
    "premium nutrition india",
    "bio-hacking essentials",
    "plant-based protein",
    "fitByte",
    "fitbyte india",
    "daily wellness",
    "premium health snacks",
    "bio-nutrition delhi",
    "nutrition supplements india",
    "lab-tested health food",
    "premium protein powders",
    "wellness essentials",
  ],
  metadataBase: new URL("https://fitbyte.in"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "fitByte | Premium Health & Bio-Nutrition India",
    description:
      "fitByte - The ultimate destination for health supplements and bio-nutrition in India. Experience the wellness revolution.",
    url: "https://fitbyte.in",
    siteName: "fitByte",
    images: [
      {
        url: "/fitbyte-logo.jpg",
        width: 1200,
        height: 630,
        alt: "fitByte Bio-Nutrition",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "fitByte | Premium Health & Bio-Nutrition India",
    description:
      "fitByte - The ultimate destination for health supplements and bio-nutrition in India.",
    images: ["/fitbyte-logo.jpg"],
    creator: "@fitbyte",
  },
  category: "health",
  classification: "Health Supplements, Bio-Nutrition, Wellness",
  verification: {
    google: "CqVr1TGrfamesut-wOLLkyz2PQUjYb-ihMDqj9zL2X0",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "fitByte",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, session, profile } = await getUnifiedAuth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased font-sans`}
      >
        <Providers
          initialUser={user}
          initialSession={session}
          initialProfile={profile}
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </Providers>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Analytics />
        <GoogleAnalytics gaId="G-2DR5KWRR1R" />
        <PWARegister />
      </body>
    </html>
  );
}
