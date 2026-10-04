import type { QuoteSelection } from "./pricing";

/** Une clases condicionales (sin dependencias). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Canal ligero entre el catálogo y el cotizador: el botón "Personalizar" de un
 * producto envía su preconfiguración y el cotizador la aplica.
 */
export const QUOTE_EVENT = "ambar:quote-preset";
export type QuotePreset = Partial<QuoteSelection> & Pick<QuoteSelection, "jobId">;

export function sendQuotePreset(preset: QuotePreset) {
  window.dispatchEvent(new CustomEvent<QuotePreset>(QUOTE_EVENT, { detail: preset }));
  document.getElementById("cotizador")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
