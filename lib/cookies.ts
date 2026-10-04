import { useSyncExternalStore } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  🍪 AVISO DE COOKIES
 *
 *  Hoy el sitio NO usa cookies de analítica ni de publicidad de terceros — solo
 *  localStorage para recordar preferencias del propio visitante (el interruptor
 *  de animaciones y esta misma elección). Aun así mostramos el aviso para pedir
 *  consentimiento antes de activar cualquier cookie no esencial en el futuro
 *  (p. ej. Google Analytics o Meta Pixel), y así evitar problemas legales.
 *
 *  Si en el futuro agregas un script de analítica, cárgalo solo cuando
 *  `getCookieConsent() === "accepted"` (o usa `useCookieConsent()` en un componente).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type CookieConsent = "unset" | "accepted" | "declined";

const STORAGE_KEY = "ambar-cookie-consent";
const listeners = new Set<() => void>();

export function getCookieConsent(): CookieConsent {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "accepted" || saved === "declined") return saved;
  } catch {
    // localStorage no disponible (modo privado estricto, etc.) — tratamos como no decidido
  }
  return "unset";
}

export function setCookieConsent(value: "accepted" | "declined") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Si no se puede guardar, el aviso simplemente reaparecerá la próxima visita
  }
  listeners.forEach((notify) => notify());
}

/** "unset" mientras el visitante no ha elegido todavía. El primer render coincide con el HTML del servidor. */
export function useCookieConsent(): CookieConsent {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    getCookieConsent,
    () => "unset",
  );
}
