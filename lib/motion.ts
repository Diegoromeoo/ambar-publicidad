/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  🎞️ ANIMACIONES, "REDUCIR MOVIMIENTO" Y AHORRO DE DATOS
 *
 *  Muchas laptops con Windows traen apagados los "Efectos de animación"
 *  (Configuración › Accesibilidad › Efectos visuales, o "Ajustar para obtener el
 *  mejor rendimiento"). En ese caso TODOS los navegadores le piden a los sitios
 *  "reducir movimiento". Aquí decides qué hace el sitio en esos casos.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const MOTION_SETTINGS = {
  /**
   * false → el sitio SIEMPRE muestra todas las animaciones y efectos (decisión de marca).
   *         Cada visitante puede pausarlas con el interruptor "Animaciones" (pie de página y menú).
   * true  → si el sistema pide "reducir movimiento", el sitio inicia con las animaciones en pausa.
   */
  respectSystemReducedMotion: false,
  /**
   * false → los videos del taller se reproducen solos aunque el navegador tenga "ahorro de datos".
   * true  → con ahorro de datos activo, los videos esperan a que el visitante toque "reproducir".
   */
  respectDataSaver: false,
  /** Clave de localStorage donde se recuerda la elección del visitante. */
  storageKey: "ambar-motion",
} as const;

export type MotionMode = "full" | "reduced";

/**
 * Script en línea para <head>: aplica `data-motion` en <html> antes del primer pintado,
 * así no hay parpadeo entre la versión animada y la pausada.
 */
export const MOTION_INIT_SCRIPT = `(function(){try{var d=document.documentElement,m=localStorage.getItem(${JSON.stringify(
  MOTION_SETTINGS.storageKey,
)});if(m!=="full"&&m!=="reduced")m=${MOTION_SETTINGS.respectSystemReducedMotion}&&matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"full";d.setAttribute("data-motion",m)}catch(e){}})()`;
