"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { syncMotionMode, useMotionMode } from "@/lib/motion-preference";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Carga diferida de Motion: los componentes `m.*` se pintan de inmediato y las
 * funciones de animación (~25 KB) llegan después, sin bloquear la primera carga.
 * Las animaciones siguen la configuración del sitio (lib/motion.ts), no la de Windows:
 * solo se pausan si el visitante lo elige con el interruptor "Animaciones".
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const mode = useMotionMode();

  // En desarrollo React remonta y limpia `data-motion` de <html>; en producción no hace nada.
  useLayoutEffect(() => {
    syncMotionMode();
  }, []);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={mode === "reduced" ? "always" : "never"}>{children}</MotionConfig>
    </LazyMotion>
  );
}
