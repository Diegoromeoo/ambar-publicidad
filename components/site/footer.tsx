import { ArrowUpRight } from "lucide-react";
import { Lockup, Mandala } from "@/components/ui/brand-logo";
import { ColorBar } from "@/components/ui/print-marks";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { NAV } from "./nav";
import { MotionToggle } from "./motion-toggle";
import { CATEGORIES } from "@/lib/catalog";
import { formatAddress, site } from "@/lib/site";
import { WA_DEFAULT_LINK } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();
  const address = formatAddress(site.locations.local);
  const socials = [
    { ...site.socials.instagram, Icon: InstagramIcon },
    { ...site.socials.tiktok, Icon: TikTokIcon },
    { ...site.socials.facebook, Icon: FacebookIcon },
  ];

  return (
    <footer className="relative isolate clip-safe border-t border-white/[0.06] bg-obsidian-950 pb-36 pt-20 sm:pb-28 sm:pt-28">
      <Mandala className="pointer-events-none absolute -bottom-[40%] left-1/2 -z-10 w-[1100px] max-w-none -translate-x-1/2 opacity-[0.045]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Llamado final */}
        <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="max-w-3xl font-display text-[2.6rem] font-medium leading-[1.02] text-white text-balance sm:text-6xl lg:text-7xl">
            ¿Listo para imprimir algo <em className="text-gold-animated font-normal italic">extraordinario</em>?
          </h2>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <a
                href={WA_DEFAULT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-7 py-4 text-[15px] font-semibold sm:inline-flex sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5" /> Cotizar por WhatsApp
              </a>
            </Magnetic>
            <a
              href={`tel:${site.phone.tel}`}
              className="btn-ghost inline-flex items-center justify-center whitespace-nowrap rounded-full px-7 py-4 text-[15px] font-medium tabular-nums"
            >
              {site.phone.display}
            </a>
          </div>
        </Reveal>

        <div aria-hidden className="hairline-gradient my-14 h-px sm:my-16" />

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Lockup className="w-[220px] sm:w-[260px]" />
            <p className="mt-6 max-w-sm font-display text-xl italic text-silver/90">{site.tagline}</p>
            <ColorBar className="mt-6" />
          </div>

          <nav aria-label="Servicios" className="md:col-span-3 lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400">Servicios</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a href="#catalogo" className="text-mist transition hover:text-white">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Secciones" className="md:col-span-4 lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400">Explora</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="text-mist transition hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-12 lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400">Contacto</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={WA_DEFAULT_LINK} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2.5 text-silver transition hover:text-white">
                  <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> WhatsApp {site.phone.display}
                  <ArrowUpRight className="h-3.5 w-3.5 text-gold-400 opacity-0 transition group-hover:opacity-100" />
                </a>
              </li>
              {socials.map(({ label, handle, url, Icon }) => (
                <li key={label}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2.5 text-mist transition hover:text-white">
                    <Icon className="h-4 w-4 text-gold-300" /> {label} <span className="text-mist/70">{handle}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-mist">
              {address.first ? (
                <>
                  {address.first}
                  <br />
                </>
              ) : null}
              {site.location.city}, {site.location.state}, {site.location.country}
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.06] pt-8 text-xs text-mist/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <MotionToggle />
          <p className="tracking-[0.2em] uppercase">Digital · Offset · {site.location.city}, Jalisco</p>
        </div>
      </div>
    </footer>
  );
}
