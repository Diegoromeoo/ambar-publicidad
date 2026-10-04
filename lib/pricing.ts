/**
 * ═════════════════════════════════════════════════════════════════════════════
 *  💰 MOTOR DE PRECIOS DEL COTIZADOR INTERACTIVO
 * ═════════════════════════════════════════════════════════════════════════════
 *
 *  Todos los precios están en PESOS MEXICANOS (MXN) y son ESTIMADOS de
 *  referencia. Para actualizar precios en el futuro solo edita las constantes
 *  marcadas con "💰 EDITA AQUÍ". No hace falta tocar la interfaz.
 *
 *  Fórmula:
 *    precioUnitario = PRECIO_BASE × multiplicadorMaterial + Σ acabados.porUnidad
 *    variable       = precioUnitario × cantidad × (1 − descuentoPorVolumen)
 *    fijo           = costoArranque + Σ acabados.arranque   (placas, grabados, pantallas, suajes)
 *    subtotal       = max(variable + fijo, MINIMO_POR_PEDIDO)
 *    rango          = subtotal × RANGE_SPREAD.low  …  subtotal × RANGE_SPREAD.high
 *
 *  Este archivo no importa nada de React: se puede probar con `npm test`.
 * ═════════════════════════════════════════════════════════════════════════════
 */

export type JobId = "hot-stamping" | "gran-formato" | "empaque" | "serigrafia" | "pop" | "editorial";

export interface Material {
  id: string;
  name: string;
  detail: string;
  /** 💰 Multiplica el precio base del trabajo (1 = material estándar). */
  multiplier: number;
  badge?: string;
}

export interface Finish {
  id: string;
  name: string;
  detail: string;
  /** 💰 Costo adicional por unidad (pieza, m² o ejemplar) en MXN. */
  perUnit: number;
  /** 💰 Costo fijo de arranque del acabado (grabado, placa, pantalla, suaje) en MXN. */
  setup: number;
}

export interface VolumeTier {
  /** A partir de esta cantidad se aplica el descuento. */
  minQty: number;
  /** 💰 Descuento decimal (0.15 = 15 %). */
  discount: number;
}

export interface JobType {
  id: JobId;
  name: string;
  tagline: string;
  examples: string;
  unit: { one: string; many: string; short: string };
  /** 💰 Precio base por unidad con el material estándar, sin acabados (MXN). */
  basePrice: number;
  /** 💰 Costo fijo de preparación: preprensa, placas, pruebas (MXN). */
  setupFee: number;
  /** 💰 Monto mínimo por pedido para este trabajo (MXN). */
  minimumOrder: number;
  minQty: number;
  step: number;
  defaultQty: number;
  quantityPresets: number[];
  materials: Material[];
  finishes: Finish[];
  volumeTiers: VolumeTier[];
}

/**
 * 💰 EDITA AQUÍ — Amplitud del rango mostrado al cliente.
 * low 0.92 / high 1.15 → un subtotal de $1,000 se muestra como "$920 – $1,150".
 */
export const RANGE_SPREAD = { low: 0.92, high: 1.15 };

/**
 * ═════════════════════════════════════════════════════════════════════════════
 *  💰 EDITA AQUÍ — CATÁLOGO DE TRABAJOS, MATERIALES, ACABADOS Y DESCUENTOS
 * ═════════════════════════════════════════════════════════════════════════════
 */
export const JOB_TYPES: JobType[] = [
  {
    id: "hot-stamping",
    name: "Hot Stamping",
    tagline: "Foil metálico en caliente",
    examples: "Tarjetas de presentación, etiquetas, invitaciones y tags",
    unit: { one: "pieza", many: "piezas", short: "pzs" },
    basePrice: 6.5, // 💰 por tarjeta 9 × 5 cm con foil a 1 cara
    setupFee: 450, // 💰 grabado (placa de magnesio) + preprensa
    minimumOrder: 750,
    minQty: 100,
    step: 50,
    defaultQty: 250,
    quantityPresets: [100, 250, 500, 1000, 2500],
    materials: [
      { id: "couche-350", name: "Couché 350 g", detail: "Blanco, liso y versátil", multiplier: 1, badge: "Estándar" },
      { id: "opalina-300", name: "Opalina 300 g", detail: "Mate con textura sutil", multiplier: 1.12 },
      { id: "lino-300", name: "Texturizado lino 300 g", detail: "Tacto de tela, muy elegante", multiplier: 1.28 },
      { id: "negro-350", name: "Papel negro 350 g", detail: "Contraste ideal para el foil", multiplier: 1.38, badge: "Favorito" },
      { id: "algodon-600", name: "Algodón 600 g", detail: "Grueso, suave, de lujo", multiplier: 1.95, badge: "Premium" },
    ],
    finishes: [
      { id: "foil-extra", name: "Segundo foil", detail: "Oro, plata, oro rosa o cobre", perUnit: 1.6, setup: 450 },
      { id: "realce", name: "Realce (relieve)", detail: "Relieve en seco que se siente al tacto", perUnit: 1.9, setup: 380 },
      { id: "barniz-uv", name: "Barniz UV selectivo", detail: "Brillo localizado sobre el diseño", perUnit: 1.2, setup: 250 },
      { id: "soft-touch", name: "Laminado soft-touch", detail: "Acabado aterciopelado", perUnit: 0.9, setup: 0 },
      { id: "cantos", name: "Cantos pintados", detail: "Bordes en color o metálicos", perUnit: 2.6, setup: 150 },
      { id: "suaje", name: "Suaje especial", detail: "Esquinas redondas o forma única", perUnit: 0.6, setup: 600 },
    ],
    volumeTiers: [
      { minQty: 250, discount: 0.15 },
      { minQty: 500, discount: 0.3 },
      { minQty: 1000, discount: 0.45 },
      { minQty: 2500, discount: 0.55 },
    ],
  },
  {
    id: "gran-formato",
    name: "Gran Formato",
    tagline: "Impresión por metro cuadrado",
    examples: "Lonas, vinil, microperforado, rígidos y backlits",
    unit: { one: "m²", many: "m²", short: "m²" },
    basePrice: 160, // 💰 por m² de lona front 13 oz
    setupFee: 0,
    minimumOrder: 250,
    minQty: 1,
    step: 1,
    defaultQty: 3,
    quantityPresets: [1, 3, 6, 12, 24, 50],
    materials: [
      { id: "lona-13", name: "Lona front 13 oz", detail: "Exterior, alta resistencia", multiplier: 1, badge: "Estándar" },
      { id: "lona-mesh", name: "Lona mesh", detail: "Microperforada, deja pasar el viento", multiplier: 1.25 },
      { id: "vinil", name: "Vinil adhesivo", detail: "Brillante o mate para muros y vitrinas", multiplier: 1.45 },
      { id: "microperforado", name: "Vinil microperforado", detail: "Para cristales con visibilidad", multiplier: 1.6 },
      { id: "backlit", name: "Tela backlit", detail: "Para cajas de luz", multiplier: 1.85, badge: "Premium" },
      { id: "rigido-pvc", name: "Rígido PVC 3 mm", detail: "Impresión UV directa", multiplier: 2.6 },
    ],
    finishes: [
      { id: "ojillos", name: "Bastilla y ojillos", detail: "Listo para colgar", perUnit: 18, setup: 0 },
      { id: "laminado", name: "Laminado anti-UV", detail: "Protección contra sol y rayones", perUnit: 65, setup: 0 },
      { id: "corte-contorno", name: "Corte a contorno", detail: "Siluetas y letras sueltas", perUnit: 48, setup: 0 },
      { id: "bastidor", name: "Bastidor / estructura", detail: "Montaje en marco metálico", perUnit: 180, setup: 150 },
    ],
    volumeTiers: [
      { minQty: 10, discount: 0.1 },
      { minQty: 25, discount: 0.18 },
      { minQty: 50, discount: 0.25 },
    ],
  },
  {
    id: "empaque",
    name: "Empaque de Lujo",
    tagline: "Cajas y estuches a la medida",
    examples: "Cajas rígidas, plegadizas, estuches y bolsas premium",
    unit: { one: "pieza", many: "piezas", short: "pzs" },
    basePrice: 68, // 💰 caja rígida tapa-fondo ~15 × 15 × 6 cm
    setupFee: 1200, // 💰 suaje + dummy + prueba de color
    minimumOrder: 2500,
    minQty: 50,
    step: 25,
    defaultQty: 100,
    quantityPresets: [50, 100, 250, 500, 1000],
    materials: [
      { id: "rigida-couche", name: "Caja rígida forrada couché", detail: "Cartón gris 1.5 mm", multiplier: 1, badge: "Estándar" },
      { id: "rigida-textura", name: "Caja rígida papel texturizado", detail: "Lino, verjurado o piel sintética", multiplier: 1.22 },
      { id: "rigida-negra", name: "Caja rígida negra soft-touch", detail: "El clásico de lujo", multiplier: 1.32, badge: "Favorito" },
      { id: "plegadiza", name: "Plegadiza sulfatada 18 pts", detail: "Ligera, ideal para producto", multiplier: 0.3 },
      { id: "kraft", name: "Kraft microcorrugado", detail: "Natural y resistente para envío", multiplier: 0.38 },
    ],
    finishes: [
      { id: "oro", name: "Grabado en oro", detail: "Hot stamping en tapa", perUnit: 6, setup: 450 },
      { id: "realce", name: "Realce (relieve)", detail: "Logotipo en relieve", perUnit: 4, setup: 400 },
      { id: "barniz-uv", name: "Barniz UV selectivo", detail: "Brillo localizado", perUnit: 3, setup: 300 },
      { id: "soft-touch", name: "Laminado soft-touch", detail: "Tacto aterciopelado", perUnit: 3.5, setup: 0 },
      { id: "inserto", name: "Inserto a la medida", detail: "Cama de espuma o cartón", perUnit: 9, setup: 500 },
      { id: "liston", name: "Listón o jaladera", detail: "Detalle para abrir con estilo", perUnit: 4, setup: 0 },
    ],
    volumeTiers: [
      { minQty: 250, discount: 0.12 },
      { minQty: 500, discount: 0.22 },
      { minQty: 1000, discount: 0.32 },
    ],
  },
  {
    id: "serigrafia",
    name: "Serigrafía",
    tagline: "Tinta directa sobre textil y más",
    examples: "Tote bags, playeras, sudaderas y bolsas de papel",
    unit: { one: "pieza", many: "piezas", short: "pzs" },
    basePrice: 42, // 💰 tote bag de manta + 1 tinta a 1 cara
    setupFee: 350, // 💰 pantalla (1 tinta)
    minimumOrder: 1200,
    minQty: 30,
    step: 10,
    defaultQty: 50,
    quantityPresets: [30, 50, 100, 250, 500],
    materials: [
      { id: "tote-manta", name: "Tote bag de manta", detail: "Algodón crudo", multiplier: 1, badge: "Estándar" },
      { id: "kraft-bag", name: "Bolsa de papel kraft", detail: "Con asa de papel torcido", multiplier: 0.72 },
      { id: "tote-lona", name: "Tote bag de lona 12 oz", detail: "Gruesa y resistente", multiplier: 1.5 },
      { id: "playera", name: "Playera algodón premium", detail: "Peinado 100 % algodón", multiplier: 2.8, badge: "Favorito" },
      { id: "sudadera", name: "Sudadera", detail: "Afelpada, con o sin gorro", multiplier: 6 },
    ],
    finishes: [
      { id: "tinta-extra", name: "Tinta adicional", detail: "Por cada color extra", perUnit: 6, setup: 350 },
      { id: "metalica", name: "Tinta metálica oro / plata", detail: "Efecto brillante", perUnit: 4.5, setup: 0 },
      { id: "dos-caras", name: "Impresión por ambos lados", detail: "Frente y reverso", perUnit: 9, setup: 350 },
      { id: "etiqueta", name: "Etiqueta personalizada", detail: "Tag o etiqueta cosida", perUnit: 5, setup: 0 },
    ],
    volumeTiers: [
      { minQty: 100, discount: 0.1 },
      { minQty: 250, discount: 0.18 },
      { minQty: 500, discount: 0.25 },
    ],
  },
  {
    id: "pop",
    name: "Material POP",
    tagline: "Punto de venta que vende",
    examples: "Volantes, habladores, tent cards, stickers y exhibidores",
    unit: { one: "pieza", many: "piezas", short: "pzs" },
    basePrice: 1.6, // 💰 volante media carta a color (digital u offset)
    setupFee: 150,
    minimumOrder: 450,
    minQty: 100,
    step: 50,
    defaultQty: 1000,
    quantityPresets: [100, 500, 1000, 2500, 5000],
    materials: [
      { id: "couche-150", name: "Couché 150 g", detail: "El estándar para volantes", multiplier: 1, badge: "Estándar" },
      { id: "couche-300", name: "Couché 300 g", detail: "Rígido, ideal para habladores", multiplier: 1.6 },
      { id: "opalina-225", name: "Opalina 225 g", detail: "Mate, elegante", multiplier: 1.7 },
      { id: "sulfatada-12", name: "Cartulina sulfatada 12 pts", detail: "Para displays y tent cards", multiplier: 1.9 },
      { id: "sticker", name: "Vinil adhesivo (stickers)", detail: "Resistente al agua", multiplier: 2.4 },
    ],
    finishes: [
      { id: "frente-vuelta", name: "Frente y vuelta", detail: "Impresión a dos caras", perUnit: 0.8, setup: 0 },
      { id: "barniz-uv", name: "Barniz UV selectivo", detail: "Brillo localizado", perUnit: 0.9, setup: 300 },
      { id: "laminado", name: "Laminado mate o brillante", detail: "Protección y color intenso", perUnit: 0.8, setup: 0 },
      { id: "suaje", name: "Suaje especial", detail: "Formas personalizadas", perUnit: 0.6, setup: 600 },
      { id: "doblez", name: "Doblez / hendido", detail: "Para trípticos y tent cards", perUnit: 0.35, setup: 0 },
    ],
    volumeTiers: [
      { minQty: 1000, discount: 0.25 },
      { minQty: 2500, discount: 0.4 },
      { minQty: 5000, discount: 0.5 },
    ],
  },
  {
    id: "editorial",
    name: "Impresión Editorial",
    tagline: "Publicaciones con presencia",
    examples: "Revistas, catálogos, libros, libretas y calendarios",
    unit: { one: "ejemplar", many: "ejemplares", short: "ej." },
    basePrice: 58, // 💰 catálogo 24 págs. tamaño carta, engrapado
    setupFee: 450, // 💰 preprensa + prueba de color
    minimumOrder: 1500,
    minQty: 50,
    step: 25,
    defaultQty: 100,
    quantityPresets: [50, 100, 250, 500, 1000],
    materials: [
      { id: "couche-130", name: "Interiores couché 130 g", detail: "Color vibrante", multiplier: 1, badge: "Estándar" },
      { id: "bond-90", name: "Interiores bond 90 g", detail: "Ideal para lectura", multiplier: 0.8 },
      { id: "cultural-90", name: "Cultural ahuesado 90 g", detail: "Tono cálido tipo libro", multiplier: 0.95 },
      { id: "couche-mate-150", name: "Couché mate 150 g", detail: "Editorial de alta gama", multiplier: 1.18, badge: "Premium" },
    ],
    finishes: [
      { id: "hotmelt", name: "Encuadernación hot melt", detail: "Lomo cuadrado (rústica)", perUnit: 18, setup: 0 },
      { id: "pasta-dura", name: "Pasta dura", detail: "Cartoné forrado", perUnit: 95, setup: 600 },
      { id: "oro", name: "Grabado en oro en portada", detail: "Hot stamping", perUnit: 9, setup: 450 },
      { id: "barniz-uv", name: "Barniz UV selectivo en portada", detail: "Brillo localizado", perUnit: 4, setup: 300 },
      { id: "soft-touch", name: "Portada soft-touch", detail: "Tacto aterciopelado", perUnit: 5, setup: 0 },
    ],
    volumeTiers: [
      { minQty: 250, discount: 0.15 },
      { minQty: 500, discount: 0.28 },
      { minQty: 1000, discount: 0.4 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Motor de cálculo (no necesitas editar debajo de esta línea para cambiar precios)
// ─────────────────────────────────────────────────────────────────────────────

export interface QuoteSelection {
  jobId: JobId;
  materialId: string;
  finishIds: string[];
  quantity: number;
}

export interface QuoteEstimate {
  job: JobType;
  material: Material;
  finishes: Finish[];
  quantity: number;
  discount: number;
  subtotal: number;
  low: number;
  high: number;
  unitLow: number;
  unitHigh: number;
}

export function getJob(id: JobId): JobType {
  const job = JOB_TYPES.find((j) => j.id === id);
  if (!job) throw new Error(`Trabajo desconocido: ${id}`);
  return job;
}

export function defaultSelection(jobId: JobId): QuoteSelection {
  const job = getJob(jobId);
  return { jobId, materialId: job.materials[0].id, finishIds: [], quantity: job.defaultQty };
}

export function volumeDiscount(job: JobType, quantity: number) {
  return job.volumeTiers.reduce((acc, tier) => (quantity >= tier.minQty ? tier.discount : acc), 0);
}

/** Redondeo "comercial": $10 debajo de $10,000; $50 hasta $50,000; $100 arriba. */
export function roundNice(value: number, direction: "down" | "up") {
  const step = value < 10_000 ? 10 : value < 50_000 ? 50 : 100;
  const fn = direction === "down" ? Math.floor : Math.ceil;
  return fn(value / step) * step;
}

export function clampQuantity(job: JobType, quantity: number) {
  if (!Number.isFinite(quantity)) return job.minQty;
  return Math.min(Math.max(Math.round(quantity), job.minQty), 100_000);
}

export function estimateQuote(selection: QuoteSelection): QuoteEstimate {
  const job = getJob(selection.jobId);
  const material = job.materials.find((m) => m.id === selection.materialId) ?? job.materials[0];
  const finishes = job.finishes.filter((f) => selection.finishIds.includes(f.id));
  const quantity = clampQuantity(job, selection.quantity);
  const discount = volumeDiscount(job, quantity);

  const unitPrice = job.basePrice * material.multiplier + finishes.reduce((sum, f) => sum + f.perUnit, 0);
  const variable = unitPrice * quantity * (1 - discount);
  const fixed = job.setupFee + finishes.reduce((sum, f) => sum + f.setup, 0);
  const subtotal = Math.max(variable + fixed, job.minimumOrder);

  const low = roundNice(subtotal * RANGE_SPREAD.low, "down");
  const high = roundNice(subtotal * RANGE_SPREAD.high, "up");
  return {
    job,
    material,
    finishes,
    quantity,
    discount,
    subtotal,
    low,
    high,
    unitLow: low / quantity,
    unitHigh: high / quantity,
  };
}

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const mxnCents = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatMXN(value: number, cents = false) {
  return (cents ? mxnCents : mxn).format(value);
}

export function formatQuantity(job: JobType, quantity: number) {
  const n = new Intl.NumberFormat("es-MX").format(quantity);
  return `${n} ${quantity === 1 ? job.unit.one : job.unit.many}`;
}

/** Mensaje estructurado para WhatsApp (usa *negritas* de WhatsApp). */
export function buildQuoteMessage(estimate: QuoteEstimate, notes = "") {
  const { job, material, finishes, quantity, low, high } = estimate;
  const lines = [
    "Hola Ámbar Publicidad, quiero cotizar este proyecto:",
    "",
    `*Tipo de trabajo:* ${job.name} (${job.examples.toLowerCase()})`,
    `*Material / papel:* ${material.name}`,
    `*Acabados especiales:* ${finishes.length ? finishes.map((f) => f.name).join(", ") : "Sin acabados especiales"}`,
    `*Cantidad / tiraje:* ${formatQuantity(job, quantity)}`,
  ];
  if (notes.trim()) lines.push(`*Notas:* ${notes.trim()}`);
  lines.push(
    "",
    `*Estimado en el sitio web:* ${formatMXN(low)} – ${formatMXN(high)} MXN`,
    "Entiendo que es un precio aproximado y que un asesor confirmará la cotización final.",
  );
  return lines.join("\n");
}
