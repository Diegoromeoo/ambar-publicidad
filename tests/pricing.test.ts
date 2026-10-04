// Pruebas del motor de precios: `npm test` (Node ≥ 22 ejecuta TypeScript directamente).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  JOB_TYPES,
  buildQuoteMessage,
  clampQuantity,
  defaultSelection,
  estimateQuote,
  getJob,
  roundNice,
  volumeDiscount,
} from "../lib/pricing.ts";

test("cada trabajo tiene una configuración por defecto válida", () => {
  for (const job of JOB_TYPES) {
    const e = estimateQuote(defaultSelection(job.id));
    assert.ok(e.low > 0, `${job.id}: low > 0`);
    assert.ok(e.high > e.low, `${job.id}: high > low`);
    assert.ok(job.quantityPresets.every((q) => q >= job.minQty), `${job.id}: presets ≥ mínimo`);
    assert.ok(job.materials.some((m) => m.multiplier === 1), `${job.id}: tiene material estándar`);
    const tiers = job.volumeTiers.map((t) => t.minQty);
    assert.deepEqual(tiers, [...tiers].sort((a, b) => a - b), `${job.id}: descuentos en orden ascendente`);
  }
});

test("hot stamping estándar: 250 tarjetas en couché", () => {
  // 6.5 × 250 × (1 − 0.15) + 450 = 1,831.25 → rango 1,680 – 2,110
  const e = estimateQuote(defaultSelection("hot-stamping"));
  assert.equal(e.quantity, 250);
  assert.equal(e.discount, 0.15);
  assert.equal(Math.round(e.subtotal * 100) / 100, 1831.25);
  assert.equal(e.low, 1680);
  assert.equal(e.high, 2110);
});

test("los acabados suman costo por unidad y arranque", () => {
  const base = estimateQuote(defaultSelection("hot-stamping"));
  const withRealce = estimateQuote({ ...defaultSelection("hot-stamping"), finishIds: ["realce"] });
  const realce = getJob("hot-stamping").finishes.find((f) => f.id === "realce")!;
  const expected = base.subtotal + realce.perUnit * 250 * (1 - 0.15) + realce.setup;
  assert.equal(Math.round(withRealce.subtotal * 100), Math.round(expected * 100));
});

test("descuentos por volumen y cantidad mínima", () => {
  const job = getJob("pop");
  assert.equal(volumeDiscount(job, 999), 0);
  assert.equal(volumeDiscount(job, 1000), 0.25);
  assert.equal(volumeDiscount(job, 5000), 0.5);
  assert.equal(clampQuantity(job, 5), job.minQty);
  assert.equal(clampQuantity(job, Number.NaN), job.minQty);
});

test("se respeta el monto mínimo por pedido", () => {
  const job = getJob("gran-formato");
  const e = estimateQuote({ ...defaultSelection("gran-formato"), quantity: 1 });
  assert.equal(e.subtotal, job.minimumOrder);
});

test("redondeo comercial", () => {
  assert.equal(roundNice(1684.7, "down"), 1680);
  assert.equal(roundNice(2105.9, "up"), 2110);
  assert.equal(roundNice(12_340, "up"), 12_350);
  assert.equal(roundNice(61_230, "down"), 61_200);
});

test("el mensaje de WhatsApp incluye todos los parámetros", () => {
  const e = estimateQuote({ jobId: "empaque", materialId: "rigida-negra", finishIds: ["oro", "inserto"], quantity: 250 });
  const msg = buildQuoteMessage(e, "Entrega en noviembre");
  assert.match(msg, /\*Tipo de trabajo:\* Empaque de Lujo/);
  assert.match(msg, /\*Material \/ papel:\* Caja rígida negra soft-touch/);
  assert.match(msg, /\*Acabados especiales:\* Grabado en oro, Inserto a la medida/);
  assert.match(msg, /\*Cantidad \/ tiraje:\* 250 piezas/);
  assert.match(msg, /\*Notas:\* Entrega en noviembre/);
  assert.match(msg, /\*Estimado en el sitio web:\* \$[\d,]+ – \$[\d,]+ MXN/);
});
