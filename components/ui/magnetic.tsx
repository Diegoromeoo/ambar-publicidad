"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { m, useMotionValue, useSpring } from "motion/react";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

/**
 * Envoltorio "magnético": el contenido sigue ligeramente al cursor dentro de su
 * propia área (como en Magic UI / Linear). Se queda quieto en pantallas táctiles
 * y cuando las animaciones están en pausa. El desplazamiento se limita para que
 * nunca produzca scroll horizontal.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
  max = 14,
}: {
  children: ReactNode;
  className?: string;
  /** Qué tan fuerte sigue al cursor (0–1). */
  strength?: number;
  /** Desplazamiento máximo en píxeles. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(clamp((e.clientX - r.left - r.width / 2) * strength));
    y.set(clamp((e.clientY - r.top - r.height / 2) * strength));
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
    >
      {children}
    </m.div>
  );
}
