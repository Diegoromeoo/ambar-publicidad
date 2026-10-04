"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Aparece suavemente al entrar en pantalla (IntersectionObserver + CSS, sin JS de animación). */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-shown={shown} className={cn("reveal", className)} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
