"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "motion/react";
import { Cookie } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { useCookieConsent, setCookieConsent } from "@/lib/cookies";

/**
 * Aviso de cookies (Aceptar / Rechazar). Aparece una sola vez, antes de que el
 * visitante haya decidido, y recuerda su elección en este navegador.
 */
export function CookieConsent() {
  const consent = useCookieConsent();
  const visible = consent === "unset";

  // Mientras el aviso está pendiente, oculta el dock social (ambos flotan abajo)
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.cookiePending = "on";
    else delete root.dataset.cookiePending;
    return () => {
      delete root.dataset.cookiePending;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          role="dialog"
          aria-label="Aviso de cookies"
          aria-live="polite"
          initial={{ y: "120%", opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 32, delay: 0.5 } }}
          exit={{ y: "120%", opacity: 0, transition: { duration: 0.3 } }}
          className="pb-safe fixed inset-x-0 bottom-0 z-[200] px-4 sm:px-6"
        >
          <div className="shadow-luxe-xl glass mx-auto flex max-w-3xl flex-col gap-4 rounded-[22px] border border-gold-400/20 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/25">
              <Cookie className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="flex-1 text-[13px] leading-relaxed text-silver/90">
              <strong className="font-semibold text-white">Usamos cookies esenciales.</strong> Guardamos en tu navegador
              preferencias como el interruptor de animaciones. No usamos cookies de publicidad ni analítica de terceros sin
              tu autorización. Puedes aceptar o rechazar el uso de cookies no esenciales en cualquier momento.
            </p>
            <div className="flex shrink-0 gap-2.5">
              <button
                type="button"
                onClick={() => setCookieConsent("declined")}
                className="btn-ghost shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-[13px] font-medium"
              >
                Rechazar
              </button>
              <Magnetic strength={0.25}>
                <button
                  type="button"
                  onClick={() => setCookieConsent("accepted")}
                  className="btn-gold shrink-0 whitespace-nowrap rounded-full px-6 py-3 text-[13px] font-semibold"
                >
                  Aceptar
                </button>
              </Magnetic>
            </div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
