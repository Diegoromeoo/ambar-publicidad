"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { Boxes, Building2, Check, ChevronDown, Clock, FileCheck2, Layers, Ruler, Zap, type LucideIcon } from "lucide-react";
import { SectionHeading, Accent } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Spotlight } from "@/components/ui/spotlight";
import { Magnetic } from "@/components/ui/magnetic";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { AGENCY_PERKS, DIRECTORY, EXPRESS_NOTE, type DirectoryEntry } from "@/lib/directory";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const AGENCY_MESSAGE =
  "Hola Ámbar Publicidad, somos una agencia y nos interesa su programa para agencias (marca blanca y tarifas preferentes). ¿Nos comparten información?";

export function Directory() {
  const [activeId, setActiveId] = useState(DIRECTORY[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const entry = DIRECTORY.find((d) => d.id === activeId)!;

  // Navegación con flechas entre pestañas (patrón ARIA tabs)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = DIRECTORY.findIndex((d) => d.id === activeId);
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + DIRECTORY.length) % DIRECTORY.length;
    setActiveId(DIRECTORY[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="directorio" aria-labelledby="directorio-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="directorio-title"
          index="04"
          eyebrow="Directorio técnico"
          title={
            <>
              Especificaciones para <Accent>proyectos exigentes</Accent>
            </>
          }
          description="Tiempos de entrega, tirajes mínimos y preparación de archivos por servicio. Pensado para diseñadores, marcas y agencias especializadas."
        />

        <div
          role="tablist"
          aria-label="Servicios"
          onKeyDown={onKeyDown}
          className="no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto border-b border-white/[0.07] px-5 sm:mx-0 sm:px-0"
        >
          {DIRECTORY.map((d, i) => {
            const selected = d.id === activeId;
            return (
              <button
                key={d.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`tab-${d.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${d.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(d.id)}
                className={cn(
                  "relative shrink-0 px-4 pb-4 pt-2 text-sm font-medium transition-colors",
                  selected ? "text-white" : "text-mist hover:text-silver",
                )}
              >
                {d.name}
                {selected ? (
                  <m.span layoutId="dir-underline" className="bg-gold absolute inset-x-3 -bottom-px h-[2px] rounded-full" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                ) : null}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={entry.id}
            id={`panel-${entry.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${entry.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
            className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12"
          >
            <EntryOverview entry={entry} />
            <EntryDetails key={entry.id} entry={entry} />
          </m.div>
        </AnimatePresence>

        {/* Programa para agencias */}
        <Reveal className="mt-20">
          <Spotlight className="shadow-luxe-lg overflow-hidden rounded-[30px] border border-gold-400/20 bg-obsidian-800/80 p-6 sm:p-10">
            <div aria-hidden className="bg-gold-soft absolute inset-0 -z-10" />
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="shadow-gold-ring inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-obsidian-950">
                  <Building2 className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 font-display text-3xl leading-tight text-white sm:text-4xl">
                  Programa para <em className="text-gold italic">agencias</em>
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">
                  Tu taller de producción de confianza: marca blanca, pruebas físicas y tarifas preferentes para que presentes a tus clientes con total tranquilidad.
                </p>
                <Magnetic className="mt-7">
                  <a
                    href={waLink(AGENCY_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Solicitar tarifas de agencia
                  </a>
                </Magnetic>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {AGENCY_PERKS.map((perk, i) => (
                  <Reveal key={perk.title} as="li" delay={i * 90} className="shadow-luxe-sm rounded-2xl border border-white/[0.07] bg-obsidian-900/60 p-5">
                    <p className="flex items-center gap-2 font-medium text-white">
                      <Check className="h-4 w-4 text-gold-400" /> {perk.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist">{perk.text}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Spotlight>
        </Reveal>
      </div>
    </section>
  );
}

function EntryOverview({ entry }: { entry: DirectoryEntry }) {
  const metrics: { Icon: LucideIcon; label: string; value: string }[] = [
    { Icon: Clock, label: "Tiempo estándar", value: entry.turnaround.standard },
    { Icon: Zap, label: "Express", value: entry.turnaround.express },
    { Icon: Boxes, label: "Tiraje mínimo", value: entry.minimum },
  ];
  return (
    <div>
      <h3 className="font-display text-3xl text-white sm:text-4xl">{entry.name}</h3>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">{entry.summary}</p>
      <dl className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {metrics.map(({ Icon, label, value }, i) => (
          <Reveal key={label} as="div" delay={i * 80} className="shadow-luxe-sm rounded-2xl border border-white/[0.07] bg-obsidian-800/70 p-4">
            <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-mist">
              <Icon className="h-3.5 w-3.5 text-gold-400" /> {label}
            </dt>
            <dd className="mt-2 font-display text-xl leading-tight text-white">{value}</dd>
          </Reveal>
        ))}
      </dl>
      <p className="mt-4 text-xs text-mist/80">{EXPRESS_NOTE}</p>
    </div>
  );
}

function EntryDetails({ entry }: { entry: DirectoryEntry }) {
  const [open, setOpen] = useState(0);
  const items: { title: string; Icon: LucideIcon; content: ReactNode }[] = [
    {
      title: "Especificaciones técnicas",
      Icon: Ruler,
      content: (
        <dl className="divide-y divide-white/[0.06]">
          {entry.specs.map((s) => (
            <div key={s.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <dt className="text-sm text-mist">{s.label}</dt>
              <dd className="text-sm font-medium text-silver sm:text-right">{s.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      title: "Materiales y formatos",
      Icon: Layers,
      content: (
        <ul className="flex flex-wrap gap-2 py-2">
          {entry.materials.map((m) => (
            <li key={m} className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-silver/90">
              {m}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Preparación de archivos",
      Icon: FileCheck2,
      content: <CheckList items={entry.files} />,
    },
    {
      title: "Opciones para agencias",
      Icon: Building2,
      content: <CheckList items={entry.agencies} />,
    },
  ];

  return (
    <div className="shadow-luxe-md divide-y divide-white/[0.07] rounded-[26px] border border-white/[0.07] bg-obsidian-800/50">
      {items.map((item, i) => {
        const expanded = open === i;
        const { Icon } = item;
        return (
          <div key={item.title}>
            <h4>
              <button
                type="button"
                id={`acc-${entry.id}-${i}`}
                aria-expanded={expanded}
                aria-controls={`acc-panel-${entry.id}-${i}`}
                onClick={() => setOpen(expanded ? -1 : i)}
                className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 transition", expanded ? "bg-gold text-obsidian-950 ring-transparent" : "text-gold-300 ring-white/10")}>
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                </span>
                <span className={cn("flex-1 font-medium transition-colors", expanded ? "text-white" : "text-silver")}>{item.title}</span>
                <ChevronDown className={cn("h-4 w-4 text-mist transition-transform duration-300", expanded && "rotate-180 text-gold-300")} />
              </button>
            </h4>
            <AnimatePresence initial={false}>
              {expanded ? (
                <m.div
                  id={`acc-panel-${entry.id}-${i}`}
                  role="region"
                  aria-labelledby={`acc-${entry.id}-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 sm:px-6 sm:pl-[4.75rem]">{item.content}</div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 py-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-sm leading-relaxed text-silver/90">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
          {t}
        </li>
      ))}
    </ul>
  );
}
