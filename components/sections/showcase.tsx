"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { m } from "motion/react";
import { Pause, Play } from "lucide-react";
import { SectionHeading, Accent } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SHOWCASE_CLIPS, PROCESS_STEPS, type ShowcaseClip } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import { MOTION_SETTINGS } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const byId = (id: string) => SHOWCASE_CLIPS.find((c) => c.id === id)!;

// "Ahorro de datos" del navegador: solo detiene la reproducción automática si
// MOTION_SETTINGS.respectDataSaver = true (lib/motion.ts)
const noopSubscribe = () => () => {};
const readSaveData = () =>
  MOTION_SETTINGS.respectDataSaver && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

export function Showcase() {
  return (
    <section id="taller" aria-labelledby="taller-title" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_85%_20%,rgba(245,158,11,0.07),transparent)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="taller-title"
          index="02"
          eyebrow="El taller"
          title={
            <>
              Del archivo al <Accent>acabado perfecto</Accent>
            </>
          }
          description="Offset, digital y gran formato bajo un mismo techo. Así se ve el oficio detrás de cada pieza impresa."
        />

        {/* Escritorio: bento con columnas balanceadas (vertical · 3 horizontales · vertical) */}
        <div className="mt-14 hidden gap-4 md:grid md:grid-cols-3 lg:gap-5">
          <Reveal className="h-full">
            <VideoTile clip={byId("offset")} index={1} className="h-full" />
          </Reveal>
          <div className="grid gap-4 lg:gap-5">
            {["taller", "uv", "sello"].map((id, i) => (
              <Reveal key={id} delay={120 + i * 90}>
                <VideoTile clip={byId(id)} index={i + 2} className="aspect-video" compact />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="h-full">
            <VideoTile clip={byId("gran-formato")} index={5} className="h-full" />
          </Reveal>
        </div>
      </div>

      {/* Móvil: carrusel tipo historias */}
      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 md:hidden">
        {SHOWCASE_CLIPS.map((clip, i) => (
          <li key={clip.id} className="w-[74%] shrink-0 snap-start">
            <VideoTile clip={clip} index={i + 1} className="aspect-[4/5]" />
          </li>
        ))}
      </ul>

      {/* Proceso */}
      <div className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <ol className="grid gap-px overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.n} className="bg-obsidian-900">
              <Reveal delay={i * 110} className="group h-full p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="text-gold font-display text-5xl italic leading-none">{step.n}</span>
                  <span aria-hidden className="hairline-gradient h-px flex-1 origin-left scale-x-50 transition-transform duration-700 group-hover:scale-x-100" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Video en bucle que solo se reproduce mientras es visible (ahorra datos y batería). */
function VideoTile({ clip, index, className, compact }: { clip: ShowcaseClip; index: number; className?: string; compact?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotionPreference();
  const saveData = useSyncExternalStore(noopSubscribe, readSaveData, () => false);
  const [blocked, setBlocked] = useState(false); // p. ej. modo de bajo consumo en iOS
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false); // ya hay cuadros de video que mostrar
  const userPaused = useRef(false);
  const autoplay = !reduced && !saveData && !blocked;

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoplay) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) video.play().catch(() => setBlocked(true));
        else if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [autoplay]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    userPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <m.figure
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      className={cn(
        "shadow-luxe-md hover:shadow-card-hover group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-obsidian-800 transition-shadow duration-500",
        className,
      )}
    >
      {/* Póster optimizado y diferido (el atributo `poster` de <video> se descarga siempre, aunque no se vea) */}
      <Image
        src={clip.poster}
        alt=""
        fill
        sizes="(min-width: 768px) 33vw, 74vw"
        className="object-cover saturate-[0.85] transition duration-[1200ms] ease-luxe group-hover:scale-[1.04] group-hover:saturate-100"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-label={clip.title}
        onPlaying={() => {
          setReady(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover saturate-[0.85] transition duration-[1200ms] ease-luxe group-hover:scale-[1.04] group-hover:saturate-100",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        <source src={clip.src} type="video/mp4" />
      </video>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/10 to-obsidian-950/20" />
      <div aria-hidden className="absolute inset-0 rounded-[22px] ring-1 ring-inset ring-gold-400/0 transition duration-500 group-hover:ring-gold-400/40" />

      <span className="glass absolute left-4 top-4 rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-100">
        {clip.tag}
      </span>
      <span className="absolute right-4 top-4 font-display text-sm italic text-white/70">0{index}</span>

      {!autoplay && !playing ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Reproducir video: ${clip.title}`}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-obsidian-950/40 text-white backdrop-blur transition hover:border-gold-400/60 hover:text-gold-200"
        >
          <Play className="ml-0.5 h-5 w-5" />
        </button>
      ) : null}

      <figcaption className={cn("absolute inset-x-0 bottom-0 flex items-end justify-between gap-3", compact ? "p-4 sm:p-5" : "p-5 sm:p-6")}>
        <div>
          <p className={cn("font-display text-white", compact ? "text-xl" : "text-2xl sm:text-[1.7rem]")}>{clip.title}</p>
          <p className={cn("mt-1 max-w-xs text-mist", compact ? "hidden text-xs lg:block" : "text-sm")}>{clip.caption}</p>
        </div>
        {autoplay || playing ? (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? `Pausar video: ${clip.title}` : `Reproducir video: ${clip.title}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-obsidian-950/40 text-white/80 backdrop-blur transition hover:border-gold-400/60 hover:text-gold-200"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
          </button>
        ) : null}
      </figcaption>
    </m.figure>
  );
}
