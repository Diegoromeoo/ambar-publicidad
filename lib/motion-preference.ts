import { useSyncExternalStore } from "react";
import { MOTION_SETTINGS, type MotionMode } from "./motion";

// Estado de animaciones del visitante. La fuente de verdad es `data-motion` en <html>
// (lo pone MOTION_INIT_SCRIPT antes de pintar) y la elección guardada en localStorage.

const listeners = new Set<() => void>();
const QUERY = "(prefers-reduced-motion: reduce)";

const readMode = (): MotionMode => (document.documentElement.getAttribute("data-motion") === "reduced" ? "reduced" : "full");

function storedMode(): MotionMode {
  try {
    const saved = localStorage.getItem(MOTION_SETTINGS.storageKey);
    if (saved === "full" || saved === "reduced") return saved;
  } catch {
    // localStorage no disponible (modo privado estricto, etc.)
  }
  return MOTION_SETTINGS.respectSystemReducedMotion && window.matchMedia(QUERY).matches ? "reduced" : "full";
}

function apply(mode: MotionMode) {
  document.documentElement.setAttribute("data-motion", mode);
  listeners.forEach((notify) => notify());
}

/** Cambia (y recuerda) si el visitante quiere las animaciones activas o en pausa. */
export function setMotionMode(mode: MotionMode) {
  try {
    localStorage.setItem(MOTION_SETTINGS.storageKey, mode);
  } catch {
    // Sin localStorage la elección dura solo esta visita
  }
  apply(mode);
}

/** Vuelve a aplicar la preferencia guardada (en desarrollo React limpia los atributos de <html> al remontar). */
export function syncMotionMode() {
  const mode = storedMode();
  if (!document.documentElement.hasAttribute("data-motion") || readMode() !== mode) apply(mode);
}

/** "full" = todas las animaciones · "reduced" = en pausa. El primer render coincide con el HTML del servidor. */
export function useMotionMode(): MotionMode {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    readMode,
    () => "full",
  );
}

export const useReducedMotionPreference = () => useMotionMode() === "reduced";
