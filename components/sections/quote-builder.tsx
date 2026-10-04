"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Info,
  Maximize2,
  Megaphone,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Shirt,
  Stamp,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading, Accent } from "@/components/ui/section-heading";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Mandala } from "@/components/ui/brand-logo";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import {
  JOB_TYPES,
  buildQuoteMessage,
  clampQuantity,
  defaultSelection,
  estimateQuote,
  formatMXN,
  formatQuantity,
  getJob,
  type JobId,
  type QuoteSelection,
} from "@/lib/pricing";
import { waLink } from "@/lib/whatsapp";
import { QUOTE_EVENT, cn, type QuotePreset } from "@/lib/utils";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { Magnetic } from "@/components/ui/magnetic";

const JOB_ICONS: Record<JobId, LucideIcon> = {
  "hot-stamping": Stamp,
  "gran-formato": Maximize2,
  empaque: Package,
  serigrafia: Shirt,
  pop: Megaphone,
  editorial: BookOpen,
};

const STEPS = ["Trabajo", "Material", "Acabados", "Cantidad"] as const;
const QUOTE_NOTE = "Nota: Precios estimados. La cotización final se confirma con un asesor según requerimientos exactos.";

// Formateadores estables (NumberTicker necesita referencias constantes)
const fmtMXN = (n: number) => formatMXN(Math.round(n));
const fmtUnit = (n: number) => formatMXN(n, true);

export function QuoteBuilder() {
  const [selection, setSelection] = useState<QuoteSelection | null>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [notes, setNotes] = useState("");
  const [qtyDraft, setQtyDraft] = useState("");
  const [showBar, setShowBar] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();

  const estimate = useMemo(() => (selection ? estimateQuote(selection) : null), [selection]);
  const job = selection ? getJob(selection.jobId) : null;

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > step ? 1 : -1);
      setStep(next);
    },
    [step],
  );

  const chooseJob = (jobId: JobId) => {
    const next = selection?.jobId === jobId ? selection : defaultSelection(jobId);
    setSelection(next);
    setQtyDraft(String(next.quantity));
    setDirection(1);
    window.setTimeout(() => setStep(1), reduced ? 0 : 280);
  };

  const update = (patch: Partial<QuoteSelection>) => setSelection((s) => (s ? { ...s, ...patch } : s));

  const setQuantity = (value: number) => {
    if (!job) return;
    const q = clampQuantity(job, value);
    update({ quantity: q });
    setQtyDraft(String(q));
  };

  const reset = () => {
    setSelection(null);
    setNotes("");
    setQtyDraft("");
    setDirection(-1);
    setStep(0);
  };

  // Preconfiguración desde el catálogo ("Personalizar")
  useEffect(() => {
    const onPreset = (e: Event) => {
      const preset = (e as CustomEvent<QuotePreset>).detail;
      const base = defaultSelection(preset.jobId);
      const next: QuoteSelection = { ...base, ...preset, finishIds: preset.finishIds ?? [] };
      setSelection(next);
      setQtyDraft(String(next.quantity));
      setDirection(1);
      setStep(1);
    };
    window.addEventListener(QUOTE_EVENT, onPreset);
    return () => window.removeEventListener(QUOTE_EVENT, onPreset);
  }, []);

  // Barra fija en móvil: visible dentro de la sección mientras el resumen no está en pantalla
  useEffect(() => {
    const section = sectionRef.current;
    const summary = summaryRef.current;
    if (!section || !summary) return;
    let inSection = false;
    let summaryVisible = false;
    const sync = () => setShowBar(inSection && !summaryVisible);
    const io1 = new IntersectionObserver(([e]) => ((inSection = e.isIntersecting), sync()), { rootMargin: "-20% 0px -20% 0px" });
    const io2 = new IntersectionObserver(([e]) => ((summaryVisible = e.isIntersecting), sync()), { threshold: 0.2 });
    io1.observe(section);
    io2.observe(summary);
    return () => {
      io1.disconnect();
      io2.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (showBar && selection) root.dataset.quoteBar = "on";
    else delete root.dataset.quoteBar;
    return () => {
      delete root.dataset.quoteBar;
    };
  }, [showBar, selection]);

  const waHref = estimate ? waLink(buildQuoteMessage(estimate, notes)) : undefined;
  const nextTier = job && selection ? job.volumeTiers.find((t) => t.minQty > selection.quantity) : undefined;

  const panel = {
    initial: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * 36 }),
    animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * -36, transition: { duration: 0.22 } }),
  };

  return (
    <section ref={sectionRef} id="cotizador" aria-labelledby="cotizador-title" className="relative clip-safe py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-obsidian-950" />
      <Mandala className="animate-spin-slow pointer-events-none absolute -left-[40%] top-10 -z-10 w-[900px] opacity-[0.05] lg:-left-[18%]" />
      <div aria-hidden className="hairline-gradient absolute inset-x-0 top-0 h-px" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="cotizador-title"
          index="03"
          eyebrow="Cotizador interactivo"
          title={
            <>
              Arma tu proyecto y recibe un <Accent>estimado al instante</Accent>
            </>
          }
          description="Elige el tipo de trabajo, el papel, los acabados y el tiraje. Te mostramos un rango de precio y enviamos todo ordenado a WhatsApp para que un asesor lo confirme."
        />

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* ── Pasos ── */}
          <div className="shadow-luxe-lg rounded-[28px] border border-white/[0.07] bg-obsidian-800/70 p-4 sm:p-7">
            <ol className="grid grid-cols-4 gap-2" aria-label="Pasos del cotizador">
              {STEPS.map((label, i) => {
                const enabled = i === 0 || Boolean(selection);
                const done = i < step;
                const current = i === step;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      disabled={!enabled}
                      onClick={() => goTo(i)}
                      aria-current={current ? "step" : undefined}
                      className="group w-full text-left disabled:cursor-not-allowed"
                    >
                      <span className="block h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
                        <span
                          className={cn("bg-gold block h-full origin-left transition-transform duration-700 ease-luxe", done || current ? "scale-x-100" : "scale-x-0")}
                        />
                      </span>
                      <span className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-mist">
                        {done ? <Check className="h-3 w-3 text-gold-400" /> : <span className="tabular-nums">0{i + 1}</span>}
                        <span className={cn("hidden sm:inline", current && "text-gold-200")}>{label}</span>
                      </span>
                      <span className={cn("mt-0.5 block text-[13px] font-medium sm:hidden", current ? "text-gold-200" : "text-silver/70")}>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="relative mt-7 min-h-[430px]">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <m.div key={step} custom={direction} variants={panel} initial="initial" animate="animate" exit="exit">
                  {step === 0 ? (
                    <fieldset>
                      <legend className="font-display text-2xl text-white sm:text-3xl">¿Qué vamos a imprimir?</legend>
                      <p className="mt-1 text-sm text-mist">Elige el tipo de trabajo. Después podrás ajustar todo lo demás.</p>
                      <div role="radiogroup" aria-label="Tipo de trabajo" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                        {JOB_TYPES.map((j) => {
                          const Icon = JOB_ICONS[j.id];
                          const checked = selection?.jobId === j.id;
                          const from = estimateQuote(defaultSelection(j.id)).low;
                          return (
                            <button
                              key={j.id}
                              type="button"
                              role="radio"
                              aria-checked={checked}
                              onClick={() => chooseJob(j.id)}
                              className={cn(
                                "group relative flex flex-col items-start rounded-2xl border p-4 text-left transition duration-300 sm:p-5",
                                checked
                                  ? "border-gold-400/70 bg-gold-400/[0.08] shadow-[0_0_0_1px_rgba(212,175,55,0.35),0_20px_40px_-25px_rgba(212,175,55,0.6)]"
                                  : "border-white/[0.08] bg-white/[0.02] hover:border-gold-400/40 hover:bg-white/[0.04]",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-11 w-11 items-center justify-center rounded-xl ring-1 transition",
                                  checked ? "bg-gold text-obsidian-950 ring-transparent" : "bg-obsidian-900 text-gold-300 ring-white/10 group-hover:ring-gold-400/40",
                                )}
                              >
                                <Icon className="h-5 w-5" strokeWidth={1.6} />
                              </span>
                              <span className="mt-4 font-display text-xl leading-tight text-white sm:text-[1.4rem]">{j.name}</span>
                              <span className="mt-1 text-xs leading-snug text-mist">{j.tagline}</span>
                              <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300/90">
                                desde {formatMXN(from)}
                              </span>
                              {checked ? <Check className="absolute right-4 top-4 h-4 w-4 text-gold-300" /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : null}

                  {step === 1 && job && selection ? (
                    <fieldset>
                      <legend className="font-display text-2xl text-white sm:text-3xl">Tipo de material / papel</legend>
                      <p className="mt-1 text-sm text-mist">{job.examples}. El porcentaje indica el impacto en el precio base.</p>
                      <div role="radiogroup" aria-label="Material" className="mt-6 grid gap-2.5 sm:grid-cols-2">
                        {job.materials.map((m) => {
                          const checked = selection.materialId === m.id;
                          const pct = Math.round((m.multiplier - 1) * 100);
                          return (
                            <button
                              key={m.id}
                              type="button"
                              role="radio"
                              aria-checked={checked}
                              onClick={() => update({ materialId: m.id })}
                              className={cn(
                                "flex items-center gap-4 rounded-2xl border p-4 text-left transition duration-300",
                                checked ? "border-gold-400/70 bg-gold-400/[0.08]" : "border-white/[0.08] bg-white/[0.02] hover:border-gold-400/40",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 transition",
                                  checked ? "bg-gold ring-transparent" : "ring-white/25",
                                )}
                              >
                                {checked ? <span className="h-1.5 w-1.5 rounded-full bg-obsidian-950" /> : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="text-[15px] font-medium text-white">{m.name}</span>
                                  {m.badge ? (
                                    <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-200">{m.badge}</span>
                                  ) : null}
                                </span>
                                <span className="mt-0.5 block text-xs text-mist">{m.detail}</span>
                              </span>
                              <span className={cn("shrink-0 text-xs font-semibold tabular-nums", pct > 0 ? "text-gold-300" : pct < 0 ? "text-emerald-300/90" : "text-mist")}>
                                {pct === 0 ? "Base" : `${pct > 0 ? "+" : "−"}${Math.abs(pct)} %`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : null}

                  {step === 2 && job && selection ? (
                    <fieldset>
                      <legend className="font-display text-2xl text-white sm:text-3xl">Acabados especiales</legend>
                      <p className="mt-1 text-sm text-mist">
                        Opcional · elige todos los que quieras.
                        {job.id === "hot-stamping" ? " El foil a una tinta ya está incluido." : ""}
                      </p>
                      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                        {job.finishes.map((f) => {
                          const checked = selection.finishIds.includes(f.id);
                          return (
                            <button
                              key={f.id}
                              type="button"
                              role="checkbox"
                              aria-checked={checked}
                              onClick={() =>
                                update({ finishIds: checked ? selection.finishIds.filter((x) => x !== f.id) : [...selection.finishIds, f.id] })
                              }
                              className={cn(
                                "flex items-start gap-4 rounded-2xl border p-4 text-left transition duration-300",
                                checked ? "border-gold-400/70 bg-gold-400/[0.08]" : "border-white/[0.08] bg-white/[0.02] hover:border-gold-400/40",
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 transition",
                                  checked ? "bg-gold ring-transparent" : "ring-white/25",
                                )}
                              >
                                {checked ? <Check className="h-3.5 w-3.5 text-obsidian-950" strokeWidth={3} /> : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[15px] font-medium text-white">{f.name}</span>
                                <span className="mt-0.5 block text-xs text-mist">{f.detail}</span>
                                <span className="mt-2 block text-[11px] font-semibold tabular-nums text-gold-300/90">
                                  +{formatMXN(f.perUnit, true)} / {job.unit.short}
                                  {f.setup ? ` · ${formatMXN(f.setup)} arranque` : ""}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : null}

                  {step === 3 && job && selection ? (
                    <fieldset>
                      <legend className="font-display text-2xl text-white sm:text-3xl">Cantidad / tiraje</legend>
                      <p className="mt-1 text-sm text-mist">
                        Mínimo {formatQuantity(job, job.minQty)}. Entre más piezas, menor precio unitario.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {job.quantityPresets.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setQuantity(q)}
                            aria-pressed={selection.quantity === q}
                            className={cn(
                              "rounded-full px-4 py-2.5 text-sm font-medium tabular-nums transition",
                              selection.quantity === q ? "bg-gold text-obsidian-950" : "text-silver ring-1 ring-white/12 hover:ring-gold-400/50",
                            )}
                          >
                            {new Intl.NumberFormat("es-MX").format(q)} {job.unit.short}
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="Menos"
                          onClick={() => setQuantity(selection.quantity - job.step)}
                          className="flex h-12 w-12 items-center justify-center rounded-full text-silver ring-1 ring-white/15 transition hover:text-gold-200 hover:ring-gold-400/50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <label className="relative flex-1 sm:max-w-[240px]">
                          <span className="sr-only">Cantidad en {job.unit.many}</span>
                          <input
                            inputMode="numeric"
                            value={qtyDraft}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^\d]/g, "");
                              setQtyDraft(raw);
                              const n = Number(raw);
                              if (n >= job.minQty) update({ quantity: clampQuantity(job, n) });
                            }}
                            onBlur={() => setQuantity(Number(qtyDraft) || job.minQty)}
                            onKeyDown={(e) => e.key === "Enter" && setQuantity(Number(qtyDraft) || job.minQty)}
                            className="h-12 w-full rounded-full border border-white/12 bg-obsidian-900 px-5 pr-16 text-lg font-medium tabular-nums text-white outline-none transition focus:border-gold-400/70"
                          />
                          <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm text-mist">{job.unit.short}</span>
                        </label>
                        <button
                          type="button"
                          aria-label="Más"
                          onClick={() => setQuantity(selection.quantity + job.step)}
                          className="flex h-12 w-12 items-center justify-center rounded-full text-silver ring-1 ring-white/15 transition hover:text-gold-200 hover:ring-gold-400/50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-5 space-y-1.5 text-sm">
                        {estimate && estimate.discount > 0 ? (
                          <p className="text-gold-200">✦ Incluye {Math.round(estimate.discount * 100)} % de descuento por volumen.</p>
                        ) : null}
                        {nextTier ? (
                          <p className="text-mist">
                            A partir de {formatQuantity(job, nextTier.minQty)} obtienes {Math.round(nextTier.discount * 100)} % de descuento.{" "}
                            <button type="button" onClick={() => setQuantity(nextTier.minQty)} className="font-medium text-gold-300 underline-offset-4 hover:underline">
                              Aplicar
                            </button>
                          </p>
                        ) : null}
                      </div>

                      <label className="mt-7 block">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Notas (opcional)</span>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value.slice(0, 400))}
                          rows={3}
                          placeholder="Medidas, colores, fecha de entrega, referencias…"
                          className="mt-2 w-full resize-none rounded-2xl border border-white/12 bg-obsidian-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-mist/60 focus:border-gold-400/70"
                        />
                      </label>
                    </fieldset>
                  ) : null}
                </m.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, step - 1))}
                disabled={step === 0}
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => goTo(step + 1)}
                  disabled={!selection}
                  className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:pointer-events-none disabled:opacity-40"
                >
                  Siguiente <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Enviar a WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* ── Resumen ── */}
          <div ref={summaryRef} className="lg:sticky lg:top-28">
            <aside aria-label="Resumen de tu cotización" className="border-beam shadow-luxe-lg rounded-[28px] bg-obsidian-800 p-6 sm:p-7">
              <p className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-400">
                Tu estimado
                {selection ? (
                  <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-mist transition hover:text-gold-200">
                    <RotateCcw className="h-3 w-3" /> Reiniciar
                  </button>
                ) : null}
              </p>

              {estimate && job && selection ? (
                <>
                  <p className="mt-4 font-display text-[2.35rem] font-medium leading-none text-white sm:text-[2.6rem]">
                    <NumberTicker value={estimate.low} format={fmtMXN} />
                    <span className="mx-1.5 text-gold-500">–</span>
                    <NumberTicker value={estimate.high} format={fmtMXN} />
                  </p>
                  <p className="mt-2 text-sm text-mist">
                    MXN · ≈ <NumberTicker value={estimate.unitLow} format={fmtUnit} /> – <NumberTicker value={estimate.unitHigh} format={fmtUnit} /> por {job.unit.one}
                  </p>
                  <p className="sr-only" aria-live="polite">
                    Estimado entre {formatMXN(estimate.low)} y {formatMXN(estimate.high)} pesos.
                  </p>

                  <dl className="mt-6 divide-y divide-white/[0.06] border-y border-white/[0.06] text-sm">
                    {[
                      { label: "Trabajo", value: job.name, step: 0 },
                      { label: "Material", value: estimate.material.name, step: 1 },
                      { label: "Acabados", value: estimate.finishes.length ? estimate.finishes.map((f) => f.name).join(", ") : "Sin acabados especiales", step: 2 },
                      { label: "Cantidad", value: formatQuantity(job, estimate.quantity), step: 3 },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start justify-between gap-4 py-3">
                        <dt className="shrink-0 text-mist">{row.label}</dt>
                        <dd className="text-right">
                          <button type="button" onClick={() => goTo(row.step)} className="text-left text-silver transition hover:text-gold-200 sm:text-right">
                            {row.value}
                          </button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <div className="mt-4">
                  <p className="font-display text-[2.35rem] leading-none text-white/25">$ — —</p>
                  <p className="mt-3 text-sm text-mist">Elige un tipo de trabajo para calcular tu estimado en tiempo real.</p>
                </div>
              )}

              <p className="mt-5 flex gap-2.5 rounded-2xl bg-gold-400/[0.06] p-3.5 text-xs leading-relaxed text-gold-100/85 ring-1 ring-gold-400/20">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                {QUOTE_NOTE}
              </p>

              {waHref ? (
                <Magnetic className="mt-5 w-full" strength={0.2}>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[15px] font-semibold"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Enviar Cotización a WhatsApp
                  </a>
                </Magnetic>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-full bg-white/[0.05] px-6 py-4 text-[15px] font-semibold text-mist ring-1 ring-white/10"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Enviar Cotización a WhatsApp
                </button>
              )}
              <p className="mt-3 text-center text-[11px] text-mist/80">Se abrirá WhatsApp con tu configuración lista para enviar.</p>
            </aside>
          </div>
        </div>
      </div>

      {/* Barra fija (móvil) */}
      <AnimatePresence>
        {showBar && estimate ? (
          <m.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3 lg:hidden"
          >
            <div className="glass flex items-center justify-between gap-3 rounded-[22px] border border-white/10 p-2.5 pl-5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.8)]">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400">Estimado</p>
                <p className="truncate font-display text-xl leading-tight text-white">
                  {formatMXN(estimate.low)} – {formatMXN(estimate.high)}
                </p>
              </div>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
              >
                <WhatsAppIcon className="h-4 w-4" /> Enviar
              </a>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
