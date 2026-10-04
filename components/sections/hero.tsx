import type { CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Gem, MapPin, Printer } from "lucide-react";
import { StaggerHeading } from "@/components/ui/stagger-heading";
import { ColorBar, CropMarks, RegistrationMark } from "@/components/ui/print-marks";
import { Magnetic } from "@/components/ui/magnetic";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { FoilCard } from "./foil-card";
import { HeroBackground } from "./hero-background";
import { WA_DEFAULT_LINK } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { PRODUCTS, productPrice } from "@/lib/catalog";
import { formatMXN } from "@/lib/pricing";

// Producto destacado junto a la tarjeta (precio tomado del catálogo)
const featured = PRODUCTS.find((p) => p.id === "tarjetas-hot-stamping")!;
const featuredPrice = productPrice(featured);

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section id="inicio" aria-label="Inicio" className="relative isolate flex min-h-[100svh] items-center clip-safe pb-20 pt-28 sm:pt-32">
      {/* ── Fondo: gradient mesh + mandala del logo + polvo de oro, con parallax de scroll ── */}
      <HeroBackground />

      <CropMarks className="inset-x-3 bottom-6 top-20 sm:inset-x-6 lg:inset-x-10" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
        <div>
          <div className="fade-up flex flex-wrap items-center gap-3" style={delay(40)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-ambar" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ambar" />
              </span>
              Impresión digital &amp; offset · GDL
            </span>
            <ColorBar className="hidden sm:flex" />
          </div>

          <StaggerHeading
            className="mt-7 font-display text-[3.05rem] font-medium leading-[0.94] tracking-[-0.02em] text-white min-[400px]:text-[3.4rem] sm:text-7xl lg:text-[5.6rem] xl:text-[6.4rem]"
            lines={[
              [{ text: "Donde el papel" }],
              [{ text: "se convierte" }],
              [{ text: "en" }, { text: "lujo.", className: "text-gold-animated pr-[0.08em] italic font-normal" }],
            ]}
          />

          <p className="fade-up mt-7 max-w-xl text-pretty text-[15px] leading-relaxed text-mist sm:text-lg" style={delay(650)}>
            Hot stamping, empaques de lujo, gran formato y serigrafía con acabados que se sienten al tacto. Diseñamos,
            imprimimos y entregamos en {site.location.city} para marcas que cuidan cada detalle.
          </p>

          <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={delay(800)}>
            <Magnetic className="w-full sm:w-auto">
              <a
                href={WA_DEFAULT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold group flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold sm:inline-flex sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Cotizar por WhatsApp
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <a href="#catalogo" className="btn-ghost group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-medium">
              Explorar Catálogo
              <ArrowDown className="h-4 w-4 text-gold-300 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </div>

          <ul className="fade-up mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/[0.07] pt-6 text-[12px] text-mist sm:text-[13px]" style={delay(950)}>
            {[
              { Icon: Printer, label: "Digital · Offset" },
              { Icon: Gem, label: "Acabados de lujo" },
              { Icon: MapPin, label: `${site.location.city}, Jal.` },
            ].map(({ Icon, label }) => (
              <li key={label} className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <Icon className="h-4 w-4 shrink-0 text-gold-400" strokeWidth={1.5} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="fade-up relative" style={delay(500)}>
          <RegistrationMark className="absolute -left-2 -top-10 hidden h-9 w-9 lg:block" />
          <div className="animate-float">
            <FoilCard />
          </div>
          <a
            href="#catalogo"
            className="group mx-auto mt-14 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-2 pr-4 text-xs text-mist backdrop-blur transition hover:border-gold-400/40 hover:text-silver sm:mt-16"
          >
            <span className="rounded-full bg-gold-400/15 px-2.5 py-1 font-semibold text-gold-200">Desde {formatMXN(featuredPrice.from)}</span>
            {featured.name} · {featuredPrice.per}
            <ArrowUpRight className="h-3.5 w-3.5 text-gold-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      <a
        href="#catalogo"
        aria-label="Desplazarse al catálogo"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-mist/70 transition hover:text-gold-300 md:flex"
      >
        Desliza
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="animate-[scroll-cue_2.2s_ease-in-out_infinite] absolute inset-x-0 top-0 h-1/2 bg-gold-400" />
        </span>
      </a>
    </section>
  );
}
