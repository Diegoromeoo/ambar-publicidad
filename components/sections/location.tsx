"use client";

import { useState, type ReactNode } from "react";
import { m } from "motion/react";
import { CircleParking, Clock, MapPin, Phone, type LucideIcon } from "lucide-react";
import { SectionHeading, Accent } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { GoogleMapsIcon, WazeIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { LazyStoreMap } from "./lazy-store-map";
import { StoreHours } from "./store-hours";
import { directionLinks, formatAddress, site, LOCATION_LIST, type LocationDetail } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function InfoRow({ Icon, title, children }: { Icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-white/[0.06] pb-5 last:border-0 last:pb-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-obsidian-900 text-gold-300 ring-1 ring-white/10">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">{title}</h3>
        <div className="mt-2 text-[15px] leading-relaxed text-silver">{children}</div>
      </div>
    </div>
  );
}

export function Location() {
  const [activeId, setActiveId] = useState<LocationDetail["id"]>("local");
  const loc = LOCATION_LIST.find((l) => l.id === activeId)!;
  const address = formatAddress(loc);
  const links = directionLinks(loc);
  const { city, state, country } = site.location;

  return (
    <section id="visitanos" aria-labelledby="visitanos-title" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_15%_60%,rgba(212,175,55,0.06),transparent)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="visitanos-title"
            index="05"
            eyebrow="Visítanos"
            title={
              <>
                Toca el papel antes de <Accent>imprimir</Accent>
              </>
            }
            description={`Dos direcciones en ${city}, ${state}: nuestro local de atención al Centro y el taller de producción, para que sepas exactamente a dónde ir.`}
          />

          {/* Selector Local / Taller */}
          <div role="tablist" aria-label="Elige la dirección" className="shadow-luxe-sm inline-flex shrink-0 gap-1 self-start rounded-full border border-white/10 bg-obsidian-800/70 p-1">
            {LOCATION_LIST.map((l) => {
              const selected = l.id === activeId;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(l.id)}
                  className={cn(
                    "relative isolate rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors duration-300",
                    selected ? "text-obsidian-950" : "text-mist hover:text-white",
                  )}
                >
                  {selected ? (
                    <m.span layoutId="location-pill" className="bg-gold absolute inset-0 -z-10 rounded-full" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  ) : null}
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal className="shadow-luxe-md relative isolate min-h-[360px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-obsidian-800 sm:min-h-[460px]">
            <LazyStoreMap location={loc} />
            <div className="glass pointer-events-none absolute left-4 top-4 z-[500] inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium text-silver">
              <MapPin className="h-3.5 w-3.5 text-gold-400" /> {loc.label} · {city}, {state}
            </div>
            <div className="glass pointer-events-none absolute bottom-4 left-4 right-4 z-[500] rounded-2xl border border-white/10 px-4 py-3 text-xs leading-relaxed text-mist sm:right-auto sm:max-w-xs">
              {loc.reference}
              {loc.byAppointment ? <span className="mt-1 block font-medium text-gold-300">Se recomienda agendar cita previa.</span> : null}
            </div>
          </Reveal>

          <Reveal delay={120} key={loc.id} className="shadow-luxe-md flex flex-col gap-5 rounded-[28px] border border-white/[0.08] bg-obsidian-800/70 p-6 sm:p-8">
            <InfoRow Icon={MapPin} title={`Dirección · ${loc.label}`}>
              {address.first ? <p className="text-white">{address.first}</p> : null}
              <p>{address.second || `${city}, ${state}`}</p>
              <p className="text-sm text-mist">{country}</p>
            </InfoRow>
            <InfoRow Icon={Clock} title="Horario">
              <StoreHours hours={loc.hours} />
            </InfoRow>
            <InfoRow Icon={CircleParking} title="Estacionamiento">
              {loc.parking}
            </InfoRow>
            <InfoRow Icon={Phone} title="Teléfono y WhatsApp">
              <a href={`tel:${site.phone.tel}`} className="text-white underline-offset-4 transition hover:text-gold-200 hover:underline">
                {site.phone.display}
              </a>
            </InfoRow>

            <div className="mt-auto pt-2">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400">Cómo llegar en Google Maps / Waze</p>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Magnetic strength={0.22}>
                  <a
                    href={links.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold flex w-full items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold"
                  >
                    <GoogleMapsIcon className="h-4 w-4" /> Google Maps
                  </a>
                </Magnetic>
                <a
                  href={links.waze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-medium"
                >
                  <WazeIcon className="h-4 w-4 text-[#33ccff]" /> Waze
                </a>
                <a
                  href={waLink(`Hola Ámbar Publicidad, me gustaría agendar una visita a su ${loc.label.toLowerCase()} (${loc.street}). ¿Qué horario tienen disponible?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-medium sm:col-span-2 lg:col-span-1 xl:col-span-2"
                >
                  <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Agendar visita por WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
