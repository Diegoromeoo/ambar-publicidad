"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { Mandala } from "@/components/ui/brand-logo";
import { GoldParticles } from "@/components/ui/gold-particles";

/**
 * Fondo del hero con parallax ligado al scroll: cada capa se desplaza a una
 * velocidad distinta mientras el visitante baja por la página (más profundidad,
 * efecto "editorial"). Cada capa va en su propio envoltorio para no pisar las
 * animaciones CSS que ya traen sus elementos (giro del mandala, polvo de oro).
 * El desplazamiento es vertical y queda contenido por el `clip-safe` del hero,
 * así que nunca provoca scroll horizontal.
 */
export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBlobs = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const yMandala = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yParticles = useTransform(scrollYProgress, [0, 1], [0, 46]);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 -z-10">
      <m.div style={{ y: yBlobs }} className="absolute inset-0">
        <div className="mesh-blob mesh-a -right-[25%] -top-[30%] h-[85vmax] w-[85vmax]" />
        <div className="mesh-blob mesh-b -bottom-[35%] -left-[30%] h-[75vmax] w-[75vmax]" />
        <div className="mesh-blob mesh-c left-[25%] top-[15%] h-[55vmax] w-[55vmax]" />
      </m.div>
      <div
        className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 6) 100%",
        }}
      />
      <m.div style={{ y: yMandala }} className="absolute inset-0">
        <Mandala className="animate-spin-slow absolute -right-[55%] top-[42%] w-[150vw] max-w-[1100px] -translate-y-1/2 opacity-[0.09] sm:-right-[35%] lg:opacity-[0.13] lg:-right-[12%] lg:w-[68vw]" />
      </m.div>
      <m.div style={{ y: yParticles }} className="absolute inset-0">
        <GoldParticles />
      </m.div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-obsidian-900" />
    </div>
  );
}
