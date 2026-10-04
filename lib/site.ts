/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DATOS DEL NEGOCIO — Ámbar Publicidad
 *  Fuente única de verdad para contacto, redes, ubicaciones y horarios.
 *  Todo el sitio (header, dock, footer, mapa, JSON-LD) lee de este archivo.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface HourRule {
  label: string;
  /** 0 = domingo … 6 = sábado. */
  days: number[];
  open: string | null;
  close: string | null;
}

export interface LocationDetail {
  id: "local" | "taller";
  /** Nombre corto para pestañas/botones. */
  label: string;
  /** Descripción corta de qué se hace ahí. */
  subtitle: string;
  street: string;
  neighborhood: string;
  postalCode: string;
  /** true si se recomienda agendar cita antes de visitar (p. ej. el taller de producción). */
  byAppointment: boolean;
  parking: string;
  reference: string;
  /**
   * Coordenadas reales de esta dirección (geocodificadas a nivel de calle).
   * `exact: true` dibuja el pin dorado y genera rutas GPS directas en Google Maps / Waze.
   */
  coords: { lat: number; lng: number };
  exact: boolean;
  /** Texto de respaldo para buscar el negocio por nombre si algún día `exact` pasa a false. */
  searchQuery: string;
  /** ⚠️ POR CONFIRMAR: horario de referencia — ajústalo al horario real de esta dirección. */
  hours: HourRule[];
}

export const site = {
  name: "Ámbar Publicidad",
  shortName: "Ámbar",
  tagline: "Impresión de lujo, hecha a mano en Guadalajara.",
  description:
    "Imprenta premium en Guadalajara: hot stamping, empaques de lujo, gran formato, serigrafía, material POP e impresión editorial. Impresión digital y offset con acabados que se sienten.",
  services: ["Digital", "Offset"] as const,

  phone: {
    display: "+52 33 2208 7799",
    tel: "+523322087799",
  },

  whatsapp: {
    /** Número en formato internacional sin "+" ni espacios (formato wa.me). */
    number: "523322087799",
    /** Mensaje precargado del botón principal "Cotizar por WhatsApp". */
    defaultMessage: "Hola Ámbar Publicidad, quiero cotizar un proyecto impreso de lujo.",
  },

  socials: {
    instagram: { label: "Instagram", handle: "@AmbarPublicidad", url: "https://www.instagram.com/ambarpublicidad/" },
    tiktok: { label: "TikTok", handle: "@AmbarPublicidad", url: "https://www.tiktok.com/@ambarpublicidad" },
    facebook: { label: "Facebook", handle: "@AmbarPublicidad", url: "https://www.facebook.com/AmbarPublicidad/" },
  },

  /** Campos compartidos por ambas direcciones (misma ciudad). */
  location: {
    city: "Guadalajara",
    state: "Jalisco",
    country: "México",
  },

  /**
   * Las dos direcciones del negocio. `local` es el showroom de atención a clientes
   * (Centro) y `taller` es la planta de producción (Álamo Industrial).
   * Coordenadas verificadas por geocodificación (nivel de calle) el 2026-10-01.
   */
  locations: {
    local: {
      id: "local",
      label: "Local",
      subtitle: "Showroom y atención a clientes",
      street: "Calle Galeana 279",
      neighborhood: "Zona Centro",
      postalCode: "44100",
      byAppointment: false,
      // ⚠️ POR CONFIRMAR: estacionamiento real frente al local.
      parking: "Estacionamientos públicos del Centro Histórico a pocos metros.",
      reference: "A unas calles del Mercado Corona, en pleno Centro de Guadalajara.",
      coords: { lat: 20.675825, lng: -103.3489 },
      exact: true,
      searchQuery: "Ámbar Publicidad, Calle Galeana 279, Zona Centro, Guadalajara, Jalisco",
      // ⚠️ POR CONFIRMAR: horario de referencia — ajústalo al horario real.
      hours: [
        { label: "Lunes a viernes", days: [1, 2, 3, 4, 5], open: "09:00", close: "19:00" },
        { label: "Sábado", days: [6], open: "10:00", close: "14:00" },
        { label: "Domingo", days: [0], open: null, close: null },
      ] as HourRule[],
    },
    taller: {
      id: "taller",
      label: "Taller",
      subtitle: "Producción e impresión",
      street: "Calle Tuerca 2175",
      neighborhood: "Álamo Industrial",
      postalCode: "44490",
      byAppointment: true,
      // ⚠️ POR CONFIRMAR: estacionamiento real frente al taller.
      parking: "Estacionamiento dentro de la zona industrial.",
      reference: "Visitas de producción y pruebas de color — agenda tu cita antes de llegar.",
      coords: { lat: 20.624245, lng: -103.335072 },
      exact: true,
      searchQuery: "Calle Tuerca 2175, Álamo Industrial, Guadalajara, Jalisco",
      // ⚠️ POR CONFIRMAR: horario de referencia — ajústalo al horario real.
      hours: [
        { label: "Lunes a viernes", days: [1, 2, 3, 4, 5], open: "09:00", close: "18:00" },
        { label: "Sábado", days: [6], open: null, close: null },
        { label: "Domingo", days: [0], open: null, close: null },
      ] as HourRule[],
    },
  } satisfies Record<"local" | "taller", LocationDetail>,

  timeZone: "America/Mexico_City",
} as const;

export type Site = typeof site;
export const LOCATION_LIST = [site.locations.local, site.locations.taller] as const;

/** Dirección en una sola línea, omitiendo los campos vacíos. */
export function formatAddress(loc: LocationDetail) {
  const { street, neighborhood, postalCode } = loc;
  const first = [street, neighborhood].filter(Boolean).join(", ");
  const second = [postalCode && `C.P. ${postalCode}`, `${site.location.city}, ${site.location.state}`].filter(Boolean).join(" · ");
  return { first, second, full: [first, second].filter(Boolean).join(" — ") };
}

/** Links de navegación GPS (Google Maps y Waze) para una dirección específica. */
export function directionLinks(loc: LocationDetail) {
  const { coords, exact, searchQuery } = loc;
  const q = encodeURIComponent(searchQuery);
  if (exact) {
    return {
      google: `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`,
      waze: `https://waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`,
    };
  }
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    waze: `https://waze.com/ul?q=${q}&navigate=yes`,
  };
}
