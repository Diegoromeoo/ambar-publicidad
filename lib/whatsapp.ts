import { site } from "./site";

/** Construye un link wa.me con el mensaje precargado (codificado para URL). */
export function waLink(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** Mensaje para cotizar un producto específico del catálogo. */
export function productMessage(productName: string, category: string) {
  return `Hola Ámbar Publicidad, me interesa cotizar: *${productName}* (${category}). ¿Me comparten opciones de materiales, acabados y tiempos de entrega?`;
}

export const WA_DEFAULT_LINK = waLink();
