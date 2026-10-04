"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { m } from "motion/react";
import { ArrowRight, Info, SlidersHorizontal } from "lucide-react";
import { SectionHeading, Accent } from "@/components/ui/section-heading";
import { Spotlight } from "@/components/ui/spotlight";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { CATEGORIES, PRODUCTS, PRICE_DISCLAIMER, productPrice, type CategoryId, type Product } from "@/lib/catalog";
import { formatMXN } from "@/lib/pricing";
import { productMessage, waLink } from "@/lib/whatsapp";
import { cn, sendQuotePreset } from "@/lib/utils";

type Filter = CategoryId | "todos";

export function Catalog() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [index, setIndex] = useState(0);
  const scroller = useRef<HTMLUListElement>(null);
  const raf = useRef(0);

  const products = useMemo(() => (filter === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)), [filter]);
  const tabs = useMemo(
    () => [{ id: "todos" as Filter, name: "Todos", count: PRODUCTS.length }, ...CATEGORIES.map((c) => ({ id: c.id as Filter, name: c.name, count: PRODUCTS.filter((p) => p.category === c.id).length }))],
    [],
  );

  // Indicador de posición del carrusel móvil
  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = scroller.current;
      const first = el?.firstElementChild as HTMLElement | null;
      if (!el || !first) return;
      setIndex(Math.round(el.scrollLeft / (first.offsetWidth + 16)));
    });
  };

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="relative clip-safe py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(60%_50%_at_20%_0%,rgba(212,175,55,0.08),transparent)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionHeading
              id="catalogo-title"
              index="01"
              eyebrow="Catálogo"
              title={
                <>
                  Servicios y productos <Accent>hechos para impresionar</Accent>
                </>
              }
              description="Explora nuestras líneas de producción con precios de referencia. Toca «Cotizar» para recibir precio exacto por WhatsApp, o «Personalizar» para armarlo en el cotizador."
            />
          </div>
          <p className="inline-flex max-w-sm shrink-0 items-start gap-2.5 rounded-2xl border border-gold-400/20 bg-gold-400/[0.05] px-4 py-3 text-xs leading-relaxed text-gold-100/85">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
            <em>*{PRICE_DISCLAIMER}</em>
          </p>
        </div>

        <m.div
          layoutScroll
          role="tablist"
          aria-label="Categorías del catálogo"
          className="no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {tabs.map((tab) => {
            const selected = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="catalogo-lista"
                onClick={() => {
                  setFilter(tab.id);
                  setIndex(0);
                }}
                className={cn(
                  "relative isolate shrink-0 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors duration-300",
                  selected ? "text-obsidian-950" : "text-mist ring-1 ring-white/10 hover:text-white hover:ring-gold-400/40",
                )}
              >
                {selected ? (
                  <m.span layoutId="catalog-pill" className="bg-gold absolute inset-0 -z-10 rounded-full" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                ) : null}
                {tab.name}
                <span className={cn("ml-2 text-[11px] tabular-nums", selected ? "text-obsidian-950/60" : "text-mist/60")}>{tab.count}</span>
              </button>
            );
          })}
        </m.div>
      </div>

      <div id="catalogo-lista" role="tabpanel" aria-label="Productos" className="mt-10">
        <m.ul
          key={filter}
          ref={scroller}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 sm:scroll-px-8 sm:px-8 md:mx-auto md:grid md:max-w-7xl md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-3"
        >
          {products.map((product, i) => (
            <m.li
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              whileHover={{ y: -8, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
              transition={{ duration: 0.7, delay: Math.min(i, 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="w-[84%] max-w-[400px] shrink-0 snap-start sm:w-[58%] md:w-auto md:max-w-none"
            >
              <ProductCard product={product} />
            </m.li>
          ))}
        </m.ul>

        {/* Indicador del carrusel (móvil) */}
        <div className="mt-2 flex items-center justify-center gap-1.5 md:hidden" aria-hidden>
          {products.map((p, i) => (
            <span key={p.id} className={cn("h-1.5 rounded-full transition-all duration-500", i === index ? "w-6 bg-gold-400" : "w-1.5 bg-white/20")} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[26px] border border-white/[0.07] bg-obsidian-800/60 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="font-display text-2xl text-white sm:text-3xl">¿Buscas algo a la medida?</p>
            <p className="mt-1 text-sm text-mist">Si se puede imprimir, lo hacemos realidad. Cuéntanos tu idea y te asesoramos.</p>
          </div>
          <a
            href={waLink("Hola Ámbar Publicidad, tengo un proyecto a la medida y me gustaría recibir asesoría.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium"
          >
            Hablar con un asesor <ArrowRight className="h-4 w-4 text-gold-300" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const category = CATEGORIES.find((c) => c.id === product.category)!;
  const price = productPrice(product);
  return (
    <Spotlight
      as="article"
      className="shadow-luxe-md hover:shadow-card-hover group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/[0.07] bg-obsidian-800/80 transition-shadow duration-500"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 84vw"
          className="object-cover brightness-[0.92] saturate-[0.75] transition duration-[1400ms] ease-luxe group-hover:scale-[1.06] group-hover:brightness-100 group-hover:saturate-100"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian-800 via-obsidian-800/10 to-obsidian-900/30" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.14),transparent_45%)]" />
        <span className="glass absolute left-4 top-4 rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-100">
          {category.name}
        </span>
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
          <p className="leading-none">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-300/90">Desde</span>
            <span className="mt-1.5 block font-display text-[2.1rem] font-medium text-white">
              {formatMXN(price.from)} <span className="font-sans text-xs font-semibold tracking-wider text-gold-200">MXN</span>
            </span>
          </p>
          <span className="mb-1 rounded-full bg-obsidian-950/60 px-2.5 py-1 text-[11px] text-silver/90 ring-1 ring-white/10">/ {price.per}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[1.65rem] leading-tight text-white">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mist">{product.description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {product.specs.map((s) => (
            <li key={s} className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-silver/80">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex gap-2 pt-6">
          <a
            href={waLink(productMessage(product.name, category.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-[13px] font-semibold"
            style={{ "--shine-delay": "2.5s" } as CSSProperties}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Cotizar
          </a>
          <button
            type="button"
            onClick={() => sendQuotePreset(product.quote)}
            className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[13px] font-medium"
            aria-label={`Personalizar ${product.name} en el cotizador`}
          >
            <SlidersHorizontal className="h-4 w-4 text-gold-300" />
            Personalizar
          </button>
        </div>
      </div>
    </Spotlight>
  );
}
