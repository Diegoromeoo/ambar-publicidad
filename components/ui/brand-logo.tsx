import { cn } from "@/lib/utils";

/**
 * Logo real de Ámbar Publicidad (vectorizado desde LOGO/Ambar Publicidad Logo.pdf)
 * aplicado como máscara CSS: se puede pintar con oro, foil animado o cualquier color.
 */
type Props = { className?: string; paint?: string; label?: string };

export function Wordmark({ className, paint = "bg-gold", label = "Ámbar Publicidad" }: Props) {
  return <span role="img" aria-label={label} className={cn("brand-mask brand-wordmark block", paint, className)} />;
}

export function Lockup({ className, paint = "bg-gold", label = "Ámbar Publicidad · Digital - Offset · Nancy Abrica" }: Props) {
  return <span role="img" aria-label={label} className={cn("brand-mask brand-lockup block", paint, className)} />;
}

export function Mandala({ className, paint = "bg-gold" }: Omit<Props, "label">) {
  return <span aria-hidden className={cn("brand-mask brand-mandala block", paint, className)} />;
}
