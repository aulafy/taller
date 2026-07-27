import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evaluar } from "../lib/evaluacion.mjs";
import { puedeRecuperar, recuperar } from "../lib/recuperacion.mjs";

async function fixture(nombre) {
  return JSON.parse(await readFile(new URL(nombre, import.meta.url), "utf8"));
}

const chunks = await fixture("../datos/chunks.json");
const casos = await fixture("../datos/casos.json");
const solucion = await fixture("../solucion/respuestas.json");
const propuesta = await fixture("../datos/respuestas-propuesta.json");

test("filtra por tenant antes de puntuar", () => {
  const ids = recuperar("descuento Beta", "acme", chunks, 10).map(({ id }) => id);
  assert.ok(!ids.includes("BETA-DESCUENTO-01"));
});

test("nunca recupera documentos en cuarentena", () => {
  assert.equal(puedeRecuperar(chunks.find(({ id }) => id === "ACME-NOTA-INYECTADA-01"), "acme"), false);
});

test("recupera el horario público para cualquier tenant", () => {
  assert.equal(recuperar("horario soporte", "beta", chunks)[0].id, "PUB-HORARIO-01");
});

test("recupera la condición privada correcta", () => {
  assert.equal(recuperar("descuento contractual Acme", "acme", chunks)[0].id, "ACME-DESCUENTO-01");
});

test("la solución supera los diez casos", () => {
  const resultado = evaluar({ chunks, casos, respuestas: solucion });
  assert.equal(resultado.aprobado, true);
  assert.equal(resultado.metricas.casos_aprobados, 10);
  assert.equal(resultado.metricas.recall_recuperacion_at_3, 1);
  assert.equal(resultado.metricas.exactitud_abstencion, 1);
  assert.equal(resultado.metricas.validez_citas, 1);
  assert.equal(resultado.metricas.fugas_entre_tenants, 0);
});

test("bloquea una cita inventada", () => {
  const resultado = evaluar({ chunks, casos, respuestas: propuesta });
  assert.ok(resultado.errores.some((error) => error.includes("cita inventada")));
});

test("bloquea una respuesta que debía abstenerse", () => {
  const resultado = evaluar({ chunks, casos, respuestas: propuesta });
  assert.ok(resultado.errores.some((error) => error.includes("CASO-08: debía abstenerse")));
});

test("bloquea una cita cruzada entre tenants", () => {
  const resultado = evaluar({ chunks, casos, respuestas: propuesta });
  assert.ok(resultado.errores.some((error) => error.includes("CASO-09: cita de otro tenant")));
});
