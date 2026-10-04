import type { StaticImageData } from "next/image";
import { defaultSelection, estimateQuote, getJob, type JobId, type QuoteSelection } from "./pricing";

// Fotografías (optimizadas desde /IMAGENES) y fotogramas de los videos (/VIDEOS).
// 📸 Para usar fotos reales de trabajos terminados: coloca el archivo en assets/images/
//    y cambia el import correspondiente. El sitio genera tamaños y formatos automáticamente.
import granFormatoRollos from "@/assets/images/gran-formato-rollos.jpg";
import papeleriaFlatlay from "@/assets/images/papeleria-flatlay.jpg";
import hotStampingSello from "@/assets/images/hot-stamping-sello.jpg";
import tallerHeidelberg from "@/assets/images/taller-heidelberg.jpg";
import sellosKraft from "@/assets/images/sellos-kraft.jpg";
import tirajesPapel from "@/assets/images/tirajes-papel.jpg";
import papelesColor from "@/assets/images/papeles-color.jpg";
import mesaDeCorte from "@/assets/images/mesa-de-corte.jpg";
import revistas from "@/assets/images/revistas.jpg";
import calendario from "@/assets/images/calendario-escritorio.jpg";
import prensaDigital from "@/assets/images/prensa-digital.jpg";
import posterGranFormato from "@/public/media/gran-formato-impresion.jpg";
import posterUv from "@/public/media/impresion-uv.jpg";
import posterPlotter from "@/public/media/plotter-corte.jpg";
import posterSelloKraft from "@/public/media/sello-kraft.jpg";

export type CategoryId = "gran-formato" | "empaques" | "hot-stamping" | "pop" | "editorial";

export const CATEGORIES: { id: CategoryId; name: string; blurb: string }[] = [
  { id: "gran-formato", name: "Gran Formato", blurb: "Lonas, vinil y rígidos que se ven desde lejos." },
  { id: "empaques", name: "Empaques de Lujo", blurb: "Cajas y bolsas que convierten el unboxing en experiencia." },
  { id: "hot-stamping", name: "Serigrafía & Hot Stamping", blurb: "Foil metálico, relieve y tinta directa." },
  { id: "pop", name: "Material POP", blurb: "Piezas de punto de venta que sí se toman." },
  { id: "editorial", name: "Impresión Editorial", blurb: "Revistas, catálogos, libros y calendarios." },
];

export interface Product {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  /**
   * 💰 PRECIO "DESDE" DEL CATÁLOGO
   * Por defecto se CALCULA con el motor del cotizador (lib/pricing.ts) usando la
   * configuración `quote` de este producto, así catálogo y cotizador siempre coinciden:
   *   - mode "unit"  → precio por pieza / m² / ejemplar   (ej. "Desde $147 MXN / m²")
   *   - mode "total" → precio del paquete completo         (ej. "Desde $1,680 MXN / 250 pzs")
   * Para fijar un precio manual, agrega `from` (MXN): { mode: "unit", from: 150 }.
   */
  price: { mode: "unit" | "total"; from?: number };
  specs: string[];
  /** Configuración estándar del producto; también es la que abre "Personalizar" en el cotizador. */
  quote: Partial<QuoteSelection> & { jobId: JobId };
}

/**
 * ═════════════════════════════════════════════════════════════════════════════
 *  PRODUCTOS DEL CATÁLOGO — EDITA AQUÍ (textos, fotos y configuración base)
 *  Los precios son aproximados, basados en configuración estándar.
 * ═════════════════════════════════════════════════════════════════════════════
 */
export const PRODUCTS: Product[] = [
  // ── Gran Formato ────────────────────────────────────────────────────────────
  {
    id: "lonas",
    category: "gran-formato",
    name: "Lonas y banners",
    description: "Impresión de alta resolución en lona front para fachadas, eventos y exteriores.",
    image: granFormatoRollos,
    imageAlt: "Rollos de impresión de gran formato con barras de color CMYK",
    price: { mode: "unit" },
    specs: ["Lona 13 oz", "Interior y exterior", "Bastilla y ojillos"],
    quote: { jobId: "gran-formato", materialId: "lona-13", quantity: 3 },
  },
  {
    id: "vinil",
    category: "gran-formato",
    name: "Vinil y rotulación",
    description: "Vitrinas, muros y vehículos con vinil brillante, mate o microperforado.",
    image: posterGranFormato,
    imageAlt: "Plotter de gran formato imprimiendo un vinil a todo color",
    price: { mode: "unit" },
    specs: ["Corte a contorno", "Microperforado", "Anti-UV"],
    quote: { jobId: "gran-formato", materialId: "vinil", quantity: 6 },
  },
  {
    id: "rigidos-uv",
    category: "gran-formato",
    name: "Rígidos con impresión UV",
    description: "Señalética y displays impresos directo sobre PVC, trovicel o acrílico.",
    image: posterUv,
    imageAlt: "Impresora UV de cama plana imprimiendo señalética en material rígido",
    price: { mode: "unit" },
    specs: ["PVC y acrílico", "Tinta UV", "Corte a medida"],
    quote: { jobId: "gran-formato", materialId: "rigido-pvc", quantity: 3 },
  },

  // ── Empaques de Lujo ────────────────────────────────────────────────────────
  {
    id: "cajas-rigidas",
    category: "empaques",
    name: "Cajas rígidas premium",
    description: "Tapa y fondo forrados, con inserto a la medida y logotipo en foil.",
    image: papeleriaFlatlay,
    imageAlt: "Composición de papelería premium con caja kraft y sellos de madera",
    price: { mode: "unit" },
    specs: ["Mín. 50 pzs", "Soft-touch", "Grabado en oro"],
    quote: { jobId: "empaque", materialId: "rigida-couche", quantity: 250 },
  },
  {
    id: "plegadizas",
    category: "empaques",
    name: "Cajas plegadizas con suaje",
    description: "Empaque de producto en cartulina sulfatada con suaje y pegado.",
    image: posterPlotter,
    imageAlt: "Cartulina entrando a una máquina de corte y suaje",
    price: { mode: "unit" },
    specs: ["Suaje a medida", "Barniz UV", "Mín. 250 pzs"],
    quote: { jobId: "empaque", materialId: "plegadiza", quantity: 1000 },
  },
  {
    id: "bolsas",
    category: "empaques",
    name: "Bolsas y empaques kraft",
    description: "Bolsas de papel con tu marca, asas de listón o papel torcido.",
    image: posterSelloKraft,
    imageAlt: "Empaque de papel kraft sellado con logotipo",
    price: { mode: "unit" },
    specs: ["Kraft o couché", "Asa de listón", "Mín. 100 pzs"],
    quote: { jobId: "serigrafia", materialId: "kraft-bag", quantity: 250 },
  },

  // ── Serigrafía & Hot Stamping ───────────────────────────────────────────────
  {
    id: "tarjetas-hot-stamping",
    category: "hot-stamping",
    name: "Tarjetas con hot stamping",
    description: "Tarjetas de presentación con foil oro, plata u oro rosa sobre papeles finos.",
    image: hotStampingSello,
    imageAlt: "Mano presionando un grabado de latón sobre papel, técnica de hot stamping",
    price: { mode: "total" },
    specs: ["Foil metálico", "Papel algodón", "Cantos pintados"],
    quote: { jobId: "hot-stamping", materialId: "couche-350", quantity: 250 },
  },
  {
    id: "etiquetas-foil",
    category: "hot-stamping",
    name: "Etiquetas con foil y realce",
    description: "Etiquetas para vino, cosmética y gourmet con relieve y brillo metálico.",
    image: tallerHeidelberg,
    imageAlt: "Prensa Heidelberg de platina para foil y realce en un taller de impresión",
    price: { mode: "total" },
    specs: ["Realce en seco", "Foil", "Suaje especial"],
    quote: { jobId: "hot-stamping", materialId: "lino-300", finishIds: ["realce"], quantity: 500 },
  },
  {
    id: "serigrafia-textil",
    category: "hot-stamping",
    name: "Serigrafía en textil y tote bags",
    description: "Tinta directa de alta cobertura en tote bags, playeras y sudaderas.",
    image: sellosKraft,
    imageAlt: "Tarjetas kraft estampadas a mano con tipos móviles",
    price: { mode: "unit" },
    specs: ["Tinta plastisol", "Tinta metálica", "Mín. 30 pzs"],
    quote: { jobId: "serigrafia", materialId: "tote-manta", quantity: 50 },
  },

  // ── Material POP ────────────────────────────────────────────────────────────
  {
    id: "volantes",
    category: "pop",
    name: "Volantes y flyers",
    description: "Impresión digital u offset a todo color, lista para repartir.",
    image: tirajesPapel,
    imageAlt: "Pilas de papel impreso listas para corte",
    price: { mode: "total" },
    specs: ["Couché 150 g", "Frente y vuelta", "Offset o digital"],
    quote: { jobId: "pop", materialId: "couche-150", quantity: 1000 },
  },
  {
    id: "displays",
    category: "pop",
    name: "Habladores y displays",
    description: "Tent cards, habladores y exhibidores de mostrador con suaje.",
    image: papelesColor,
    imageAlt: "Hojas de papel de colores curvadas con luz de estudio",
    price: { mode: "total" },
    specs: ["Cartulina 12 pts", "Suaje", "Doblez"],
    quote: { jobId: "pop", materialId: "couche-300", finishIds: ["doblez"], quantity: 500 },
  },
  {
    id: "stickers",
    category: "pop",
    name: "Stickers y etiquetas de vinil",
    description: "Stickers resistentes al agua con corte a contorno para empaques y promoción.",
    image: mesaDeCorte,
    imageAlt: "Mesa de corte con cúter, cuentahílos y pliegos impresos",
    price: { mode: "total" },
    specs: ["Vinil adhesivo", "Corte a contorno", "Laminado"],
    quote: { jobId: "pop", materialId: "sticker", quantity: 500 },
  },

  // ── Impresión Editorial ─────────────────────────────────────────────────────
  {
    id: "revistas",
    category: "editorial",
    name: "Revistas y catálogos",
    description: "Publicaciones engrapadas o con lomo cuadrado y portada con acabados.",
    image: revistas,
    imageAlt: "Revistas impresas enrolladas mostrando portadas a color",
    price: { mode: "unit" },
    specs: ["Couché 130 g", "Hot melt", "Portada soft-touch"],
    quote: { jobId: "editorial", materialId: "couche-130", quantity: 100 },
  },
  {
    id: "calendarios",
    category: "editorial",
    name: "Calendarios de escritorio",
    description: "Calendarios con wire-o, base de cartón y diseño personalizado.",
    image: calendario,
    imageAlt: "Calendario de escritorio con espiral wire-o",
    price: { mode: "unit" },
    specs: ["Wire-o", "Base rígida", "Mín. 50 pzs"],
    quote: { jobId: "editorial", materialId: "couche-mate-150", quantity: 100 },
  },
  {
    id: "libros",
    category: "editorial",
    name: "Libros y libretas",
    description: "Tirajes cortos o largos con lomo cuadrado, pasta dura opcional y grabado en oro.",
    image: prensaDigital,
    imageAlt: "Prensa digital de producción con panel de control",
    price: { mode: "unit" },
    specs: ["Hot melt", "Pasta dura", "Grabado en oro"],
    quote: { jobId: "editorial", materialId: "cultural-90", finishIds: ["hotmelt"], quantity: 100 },
  },
];

/** Precio "Desde" y su etiqueta (por unidad o por paquete) para un producto del catálogo. */
export function productPrice(product: Product) {
  const selection: QuoteSelection = { ...defaultSelection(product.quote.jobId), ...product.quote, finishIds: product.quote.finishIds ?? [] };
  const job = getJob(selection.jobId);
  if (process.env.NODE_ENV !== "production") {
    const known = [...job.materials, ...job.finishes].map((x) => x.id);
    const unknown = [selection.materialId, ...selection.finishIds].filter((id) => !known.includes(id));
    if (unknown.length) console.warn(`[catálogo] "${product.id}" usa IDs que no existen en lib/pricing.ts: ${unknown.join(", ")}`);
  }
  const estimate = estimateQuote(selection);
  const computed = product.price.mode === "unit" ? estimate.unitLow : estimate.low;
  const per =
    product.price.mode === "unit" ? job.unit.one : `${new Intl.NumberFormat("es-MX").format(estimate.quantity)} ${job.unit.short}`;
  return { from: product.price.from ?? computed, per };
}

/** Se muestra en cursiva con asterisco en el badge del catálogo. */
export const PRICE_DISCLAIMER =
  "Precios aproximados basados en configuración estándar. Sujetos a cambios según acabados y tiraje.";
