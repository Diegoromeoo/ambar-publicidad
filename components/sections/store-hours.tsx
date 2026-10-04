"use client";

import { useEffect, useState } from "react";
import { site, type HourRule } from "@/lib/site";
import { cn } from "@/lib/utils";

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "19:00" → "7:00 p. m." */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

/** Día y minuto actuales en la zona horaria del negocio (Guadalajara). */
function nowAtShop() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return { day: WEEKDAY_EN.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const ruleFor = (hours: HourRule[], day: number) => hours.find((r) => r.days.includes(day));

function computeStatus(hours: HourRule[]) {
  const { day, minutes } = nowAtShop();
  const today = ruleFor(hours, day);
  if (today?.open && today.close && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, day, text: `Abierto ahora · cierra a las ${formatTime(today.close)}` };
  }
  for (let offset = 0; offset < 7; offset++) {
    const d = (day + offset) % 7;
    const rule = ruleFor(hours, d);
    if (!rule?.open) continue;
    if (offset === 0 && minutes >= toMinutes(rule.open)) continue;
    const when = offset === 0 ? "hoy" : offset === 1 ? "mañana" : `el ${DAY_NAMES[d]}`;
    return { open: false, day, text: `Cerrado · abre ${when} a las ${formatTime(rule.open)}` };
  }
  return { open: false, day, text: "Cerrado" };
}

/** Horario con estado en vivo (se calcula en el navegador para evitar desajustes de hidratación). */
export function StoreHours({ hours }: { hours: HourRule[] }) {
  const [status, setStatus] = useState<ReturnType<typeof computeStatus> | null>(null);

  useEffect(() => {
    const tick = () => setStatus(computeStatus(hours));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [hours]);

  return (
    <div>
      <p
        className={cn(
          "inline-flex min-h-7 items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-opacity",
          status ? "opacity-100" : "opacity-0",
          status?.open ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/25" : "bg-white/[0.04] text-mist ring-1 ring-white/10",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", status?.open ? "bg-emerald-400" : "bg-mist/60")} />
        {status?.text ?? "Consultando horario…"}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {hours.map((rule) => {
          const isToday = status ? rule.days.includes(status.day) : false;
          return (
            <li key={rule.label} className={cn("flex justify-between gap-4", isToday ? "text-white" : "text-mist")}>
              <span className="flex items-center gap-2">
                {rule.label}
                {isToday ? <span className="rounded-full bg-gold-400/15 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-gold-200">Hoy</span> : null}
              </span>
              <span className="tabular-nums">{rule.open && rule.close ? `${formatTime(rule.open)} – ${formatTime(rule.close)}` : "Cerrado"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
