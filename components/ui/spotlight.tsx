"use client";

import { useRef, type ElementType, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Tarjeta con brillo que sigue al cursor (glare + borde dorado).
 * Solo actualiza variables CSS en el elemento: sin re-renders de React.
 */
export function Spotlight({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <Tag ref={ref} onPointerMove={onMove} className={cn("spotlight", className)}>
      {children}
    </Tag>
  );
}
