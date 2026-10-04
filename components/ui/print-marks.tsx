import { cn } from "@/lib/utils";

/** Marcas de corte de imprenta en las esquinas: guiño de oficio al pliego impreso. */
export function CropMarks({ className }: { className?: string }) {
  const corner = "absolute h-6 w-6 text-gold-500/50";
  const path = "M0 10H7M10 0V7";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {[
        "left-0 top-0",
        "right-0 top-0 -scale-x-100",
        "bottom-0 left-0 -scale-y-100",
        "bottom-0 right-0 -scale-100",
      ].map((pos) => (
        <svg key={pos} viewBox="0 0 24 24" className={cn(corner, pos)} fill="none" stroke="currentColor" strokeWidth="1">
          <path d={path} />
        </svg>
      ))}
    </div>
  );
}

/** Marca de registro (⊕) usada en pliegos para alinear las tintas. */
export function RegistrationMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={cn("text-gold-500/60", className)} fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="20" cy="20" r="9" />
      <circle cx="20" cy="20" r="4.5" />
      <path d="M20 2v36M2 20h36" />
    </svg>
  );
}

/** Tira de control de color CMYK + oro, como en los pliegos de prensa. */
export function ColorBar({ className }: { className?: string }) {
  const swatches = ["#00AEEF", "#EC008C", "#FFF200", "#111111", "#D4AF37", "#F59E0B"];
  return (
    <div aria-hidden className={cn("flex overflow-hidden rounded-[2px] ring-1 ring-white/10", className)}>
      {swatches.map((c) => (
        <span key={c} className="h-2 w-3.5 opacity-80" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}
