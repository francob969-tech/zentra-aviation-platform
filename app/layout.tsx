import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import { SITE_NAME, SITE_URL, CONTACT_EMAIL, BASE, AIRCRAFT, SEO, THEME } from "@/lib/aero";
import "./globals.css";

// Display serif de alta elegancia (sensación editorial / aviación privada premium)
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: "/" },
  authors: [{ name: SITE_NAME }],
  openGraph: {
    title: SEO.ogTitle,
    description: SEO.ogDescription,
    type: "website",
    url: "/",
    locale: SEO.locale,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.ogTitle,
    description: SEO.twitterDescription,
  },
};

// Datos estructurados — negocio local de aviación (schema.org no tiene tipo
// "taxi aéreo"; LocalBusiness + additionalType es lo recomendado)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  additionalType: "https://schema.org/Airline",
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  image: `${SITE_URL}/opengraph-image`,
  description: SEO.schemaDescription,
  address: {
    "@type": "PostalAddress",
    addressLocality: SEO.schemaAddress.locality,
    addressRegion: SEO.schemaAddress.region,
    addressCountry: SEO.schemaAddress.country,
  },
  areaServed: SEO.areaServed,
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: SEO.offerName,
      description: `Traslados ejecutivos y regionales en ${AIRCRAFT.model} desde ${BASE.name}.`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  // Inyecta la paleta de THEME como variables CSS en <html> (fuente única de marca)
  const themeVars = {
    "--aero-void": THEME.colors.void,
    "--aero-deep": THEME.colors.deep,
    "--aero-panel": THEME.colors.panel,
    "--aero-line": THEME.colors.line,
    "--aero-text": THEME.colors.text,
    "--aero-muted": THEME.colors.muted,
    "--aero-dim": THEME.colors.dim,
    "--aero-cyan": THEME.colors.accent,
    "--aero-cyan-dim": THEME.colors.accentDim,
    "--aero-silver": THEME.colors.silver,
  } as React.CSSProperties;
  return (
    <html
      lang="es"
      style={themeVars}
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body className="bg-[#060A10] text-[#EDF2F6] antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
