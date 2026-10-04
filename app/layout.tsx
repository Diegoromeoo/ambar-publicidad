import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import { MotionProvider } from "@/components/providers/motion-provider";
import { CookieConsent } from "@/components/site/cookie-consent";
import { MOTION_INIT_SCRIPT } from "@/lib/motion";
import "./globals.css";

// Titulares editoriales (serif) + interfaz y texto (sans). Ambas son fuentes variables: 3 archivos en total.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

/**
 * URL pública del sitio para enlaces absolutos (vista previa en WhatsApp/Instagram/Facebook).
 * Define NEXT_PUBLIC_SITE_URL (ej. https://tudominio.com). En Vercel se usa el dominio de producción automáticamente.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
const title = "Ámbar Publicidad · Impresión de lujo en Guadalajara";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl ?? "http://localhost:3000"),
  title: { default: title, template: "%s · Ámbar Publicidad" },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "imprenta en Guadalajara",
    "hot stamping Guadalajara",
    "empaques de lujo",
    "cajas rígidas personalizadas",
    "impresión gran formato",
    "lonas Guadalajara",
    "serigrafía",
    "material POP",
    "impresión offset",
    "impresión digital",
    "tarjetas de presentación premium",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  alternates: siteUrl ? { canonical: "/" } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0F1115",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Datos estructurados para Google (negocio local). Agrega horario y coordenadas cuando estén confirmados.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.description,
  telephone: site.phone.tel,
  priceRange: "$$",
  areaServed: `${site.location.city}, ${site.location.state}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.locations.local.street}, ${site.locations.local.neighborhood}`,
    postalCode: site.locations.local.postalCode,
    addressLocality: site.location.city,
    addressRegion: site.location.state,
    addressCountry: "MX",
  },
  ...(site.locations.local.exact
    ? { geo: { "@type": "GeoCoordinates", latitude: site.locations.local.coords.lat, longitude: site.locations.local.coords.lng } }
    : {}),
  ...(siteUrl ? { url: siteUrl, image: `${siteUrl}/opengraph-image.jpg` } : {}),
  sameAs: [site.socials.instagram.url, site.socials.tiktok.url, site.socials.facebook.url],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" data-scroll-behavior="smooth" className={`${cormorant.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Aplica la preferencia de animaciones (lib/motion.ts) antes del primer pintado */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <a
          href="#catalogo"
          className="sr-only z-[100] rounded-full bg-gold-400 px-5 py-3 text-sm font-semibold text-obsidian-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <MotionProvider>{children}</MotionProvider>
        <CookieConsent />
        <div aria-hidden className="grain" />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
