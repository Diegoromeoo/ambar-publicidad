"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { useReducedMotionPreference } from "@/lib/motion-preference";

/**
 * Número que se anima al cambiar. React solo pinta el valor inicial; después el
 * texto se actualiza por ref en cada cuadro (sin re-renders). Pasa un `format` estable.
 */
export function NumberTicker({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);
  const [initial] = useState(() => format(value));
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || current.current === value) {
      current.current = value;
      el.textContent = format(value);
      return;
    }
    const controls = animate(current.current, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        current.current = v;
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, format, reduced]);

  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  );
}
