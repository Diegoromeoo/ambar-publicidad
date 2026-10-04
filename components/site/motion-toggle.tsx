"use client";

import { setMotionMode, useMotionMode } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

/** Interruptor para pausar/activar todas las animaciones del sitio (accesibilidad). */
export function MotionToggle({ className }: { className?: string }) {
  const on = useMotionMode() === "full";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setMotionMode(on ? "reduced" : "full")}
      className={cn("inline-flex items-center gap-2.5 rounded-full text-xs text-mist transition-colors hover:text-silver", className)}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-4 w-7 shrink-0 rounded-full ring-1 transition-colors duration-300",
          on ? "bg-gold-400/80 ring-gold-400/40" : "bg-white/10 ring-white/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform duration-300",
            on ? "translate-x-3.5" : "translate-x-0.5",
          )}
        />
      </span>
      <span>
        Animaciones{" "}
        <span aria-hidden className={on ? "text-gold-300" : undefined}>
          {on ? "activadas" : "en pausa"}
        </span>
      </span>
    </button>
  );
}
