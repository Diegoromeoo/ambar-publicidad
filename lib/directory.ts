import type { CategoryId } from "./catalog";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DIRECTORIO TÉCNICO — especificaciones, tiempos de entrega y mínimos.
 *  ⚠️ POR CONFIRMAR: datos técnicos de referencia de la industria. Valida con el
 *  taller (medidas máximas, tiempos reales y mínimos) antes de publicar.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface DirectoryEntry {
  id: CategoryId;
  name: string;
  summary: string;
  turnaround: { standard: string; express: string };
  minimum: string;
  specs: { label: string; value: string }[];
  materials: string[];
  files: string[];
  agencies: string[];
}

/** Requisitos de archivo comunes a casi todos los servicios. */
const BASE_FILES = [
  "PDF de alta resolución (PDF/X-1a o PDF/X-4)",
  "Modo de color CMYK · tintas Pantone indicadas por nombre",
  "Textos convertidos a curvas o fuentes incrustadas",
];

export const DIRECTORY: DirectoryEntry[] = [
  {
    id: "gran-formato",
    name: "Gran Formato",
    summary: "Impresión eco-solvente y UV para exterior e interior, por metro cuadrado.",
    turnaround: { standard: "24 – 48 h", express: "Mismo día*" },
    minimum: "1 m²",
    specs: [
      { label: "Resolución de impresión", value: "Hasta 1440 dpi" },
      { label: "Ancho máximo", value: "Hasta 3.20 m (según material)" },
      { label: "Rígidos UV", value: "Hasta 2.44 × 1.22 m" },
      { label: "Uniones", value: "Termosellado para piezas de mayor tamaño" },
    ],
    materials: ["Lona front 13 oz y mesh", "Vinil brillante, mate y microperforado", "Tela backlit", "PVC espumado, trovicel y acrílico"],
    files: [...BASE_FILES, "Escala 1:1 a 100–150 dpi, o 1:10 a 300 dpi", "5 cm de margen para bastilla y ojillos"],
    agencies: ["Instalación en sitio (cotización por separado)", "Impresión en marca blanca con envío directo", "Revisión de archivos de producción"],
  },
  {
    id: "empaques",
    name: "Empaques de Lujo",
    summary: "Cajas rígidas, plegadizas y bolsas a la medida con acabados premium.",
    turnaround: { standard: "10 – 15 días hábiles", express: "7 días hábiles*" },
    minimum: "50 piezas (rígidas) · 250 (plegadizas)",
    specs: [
      { label: "Estructuras", value: "Tapa-fondo, libro, cajón corredizo, imán" },
      { label: "Cartón rígido", value: "1.5 mm a 2.5 mm" },
      { label: "Dummy / muestra", value: "Prototipo físico antes del tiraje" },
      { label: "Insertos", value: "Espuma, cartón o termoformado" },
    ],
    materials: ["Couché, texturizados y papeles importados", "Sulfatada 14 – 24 pts", "Kraft y microcorrugado", "Forros soft-touch y piel sintética"],
    files: [...BASE_FILES, "Arte montado sobre el suaje (dieline) que te proporcionamos", "Foil y barniz en capas separadas al 100 % K"],
    agencies: ["Desarrollo de suaje y dummy para presentar al cliente", "Envío directo a tu cliente sin logotipos de Ámbar", "Almacenaje y entregas parciales"],
  },
  {
    id: "hot-stamping",
    name: "Serigrafía & Hot Stamping",
    summary: "Foil metálico en caliente, realce en seco y serigrafía de alta cobertura.",
    turnaround: { standard: "5 – 7 días hábiles", express: "72 h*" },
    minimum: "100 piezas (foil) · 30 piezas (textil)",
    specs: [
      { label: "Área máxima de foil", value: "Hasta 20 × 28 cm por golpe" },
      { label: "Grosor mínimo de línea", value: "0.3 mm (foil) · 0.5 mm (realce)" },
      { label: "Colores de foil", value: "Oro, plata, oro rosa, cobre, holográfico" },
      { label: "Serigrafía", value: "Hasta 6 tintas, plastisol y base agua" },
    ],
    materials: ["Algodón 300 – 600 g", "Papeles negros y de color sólido", "Texturizados lino y verjurado", "Textil: manta, lona, algodón peinado"],
    files: [...BASE_FILES, "Elementos de foil en vector al 100 % de un solo color", "Serigrafía: separación de color por tinta"],
    agencies: ["Pruebas de foil sobre papeles a elegir", "Muestrario físico de papeles y foils", "Tarifas preferentes por volumen recurrente"],
  },
  {
    id: "pop",
    name: "Material POP",
    summary: "Volantes, habladores, displays y stickers para punto de venta.",
    turnaround: { standard: "2 – 3 días (digital)", express: "24 h*" },
    minimum: "100 piezas",
    specs: [
      { label: "Tecnología", value: "Digital para tirajes cortos · Offset desde 1,000 pzs" },
      { label: "Formato máximo digital", value: "33 × 48 cm" },
      { label: "Formato máximo offset", value: "Pliego 57 × 87 cm" },
      { label: "Suaje", value: "Formas especiales y habladores troquelados" },
    ],
    materials: ["Couché 130 – 300 g", "Opalina y bond", "Sulfatada 12 – 18 pts", "Vinil adhesivo y estático"],
    files: [...BASE_FILES, "3 mm de rebase por lado", "Zona de seguridad de 5 mm para textos"],
    agencies: ["Kits de campaña armados por tienda", "Distribución en Guadalajara y zona metropolitana", "Reimpresiones con archivo resguardado"],
  },
  {
    id: "editorial",
    name: "Impresión Editorial",
    summary: "Revistas, catálogos, libros y calendarios con encuadernación profesional.",
    turnaround: { standard: "7 – 12 días hábiles", express: "5 días hábiles*" },
    minimum: "50 ejemplares",
    specs: [
      { label: "Encuadernación", value: "Grapa, hot melt, cosido, wire-o, pasta dura" },
      { label: "Páginas", value: "De 8 a 400+ páginas (según encuadernación)" },
      { label: "Pruebas", value: "Prueba de color física y dummy de encuadernación" },
      { label: "Tirajes", value: "Digital bajo demanda u offset para volumen" },
    ],
    materials: ["Couché brillante y mate", "Bond y cultural ahuesado", "Portadas 250 – 350 g", "Cartoné para pasta dura"],
    files: [...BASE_FILES, "Páginas individuales en orden, con 3 mm de rebase", "Lomo calculado según papel y número de páginas"],
    agencies: ["Asesoría de imposición y cálculo de lomo", "Entregas escalonadas para lanzamientos", "Resguardo de archivos para reimpresión"],
  },
];

/** Beneficios del programa para agencias (tarjeta destacada del directorio). */
export const AGENCY_PERKS = [
  { title: "Marca blanca", text: "Entregamos sin logotipos de Ámbar, listo para tu cliente." },
  { title: "Tarifas de agencia", text: "Precios preferentes por volumen y proyectos recurrentes." },
  { title: "Pruebas y dummies", text: "Prototipos físicos para presentar y aprobar antes del tiraje." },
  { title: "Un solo contacto", text: "Asesor dedicado por WhatsApp de principio a fin." },
];

export const EXPRESS_NOTE = "*Servicio express sujeto a disponibilidad y con costo adicional.";
