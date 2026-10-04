"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { animate, m, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { Mandala } from "@/components/ui/brand-logo";
import { site } from "@/lib/site";

/**
 * Tarjeta de presentación 3D con el logo real en foil dorado (hot stamping),
 * realce en seco del mandala y brillo que sigue al puntero (o se anima solo en móvil).
 */
export function FoilCard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();
  const rx = useMotionValue(6);
  const ry = useMotionValue(-12);
  const gx = useMotionValue(35);
  const gy = useMotionValue(30);
  const rotateX = useSpring(rx, { stiffness: 110, damping: 16 });
  const rotateY = useSpring(ry, { stiffness: 110, damping: 16 });
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,250,230,0.28), rgba(255,250,230,0.05) 30%, transparent 55%)`;
  const foilPosition = useMotionTemplate`${gx}% ${gy}%`;

  // En pantallas táctiles la tarjeta "respira" sola
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: coarse)").matches) return;
    const opts = { duration: 7, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const };
    const a = animate(ry, [-14, 12], opts);
    const b = animate(rx, [8, -4], { ...opts, duration: 9 });
    const c = animate(gx, [15, 85], opts);
    const d = animate(gy, [20, 70], { ...opts, duration: 9 });
    return () => [a, b, c, d].forEach((x) => x.stop());
  }, [reduced, rx, ry, gx, gy]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 26);
    rx.set((0.5 - py) * 20);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(6);
    ry.set(-12);
    gx.set(35);
    gy.set(30);
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative mx-auto w-full max-w-[540px] [perspective:1400px]">
      {/* Halo */}
      <div aria-hidden className="absolute inset-x-[8%] inset-y-[14%] rounded-[48px] bg-gold-400/25 blur-[70px]" />

      {/* Tarjeta trasera (reverso) */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-[7%] translate-y-[16%] rotate-[8deg] rounded-[18px] bg-[#101217] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/[0.07]"
        style={{ aspectRatio: "1.75 / 1" }}
      >
        <div className="flex h-full flex-col justify-end gap-1 p-[6%]">
          <span className="text-gold font-display text-[clamp(0.8rem,2.4vw,1.05rem)] italic">Cotiza por WhatsApp</span>
          <span className="text-[clamp(0.6rem,1.8vw,0.75rem)] tracking-[0.28em] text-mist">{site.phone.display}</span>
        </div>
      </div>

      {/* Tarjeta frontal */}
      <m.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", aspectRatio: "1.75 / 1" }}
        className="relative overflow-hidden rounded-[18px] bg-[#0b0c0f] shadow-[0_50px_90px_-30px_rgba(0,0,0,1),0_0_0_1px_rgba(212,175,55,0.35)]"
      >
        {/* Textura de papel lino */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 4px)",
          }}
        />
        {/* Realce en seco (blind emboss) del mandala */}
        <Mandala paint="bg-white/[0.06]" className="absolute right-[calc(-16%+1px)] top-[calc(50%-1px)] w-[62%] -translate-y-1/2" />
        <Mandala paint="bg-black/70" className="absolute right-[calc(-16%-1px)] top-[calc(50%+1px)] w-[62%] -translate-y-1/2" />
        <Mandala paint="bg-[#0b0c0f]" className="absolute -right-[16%] top-1/2 w-[62%] -translate-y-1/2" />

        {/* Logo en foil dorado */}
        <m.span
          role="img"
          aria-label="Logotipo de Ámbar Publicidad impreso en foil dorado"
          style={{ backgroundPosition: foilPosition }}
          className="brand-mask brand-lockup foil absolute left-[8%] top-1/2 block w-[52%] -translate-y-1/2 drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]"
        />

        {/* Detalles de imprenta */}
        <span aria-hidden className="absolute bottom-[8%] left-[8%] text-[clamp(0.5rem,1.4vw,0.62rem)] uppercase tracking-[0.34em] text-gold-500/60">
          Hot stamping · Foil oro
        </span>
        <span aria-hidden className="absolute right-[5%] top-[8%] h-1.5 w-1.5 rounded-full bg-gold-400/70 shadow-[0_0_12px_2px_rgba(245,158,11,0.6)]" />

        {/* Brillo */}
        <m.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 mix-blend-screen" />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/[0.06]" />
      </m.div>
    </div>
  );
}
