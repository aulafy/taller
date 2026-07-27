import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseCsv, toCsv } from "../lib/csv.mjs";
import { buildGold, evaluate, normalizeDate } from "../lib/evaluacion.mjs";

const readJson = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));
const source = readJson("../datos/extracto-sintetico.json");
const catalog = readJson("../datos/catalogo.json");
const schema = readJson("../datos/esquema.json");
const gold = buildGold(source, catalog);

test("la solución conserva exactamente 20 IDs y concilia en céntimos", () => {
  const result = evaluate(source, catalog, schema, gold);
  assert.equal(result.ok, true);
  assert.equal(result.metrics.filas_origen, 20);
  assert.equal(result.metrics.diferencia_centimos, 0);
});

test("la propuesta defectuosa revela filas ausentes e inventadas", () => {
  const candidate = parseCsv(fs.readFileSync(new URL("../datos/propuesta-ia.csv", import.meta.url), "utf8"));
  const codes = evaluate(source, catalog, schema, candidate).errors.map((error) => error.code);
  assert.ok(codes.includes("AUSENTE"));
  assert.ok(codes.includes("INVENTADO"));
});

test("detecta signo y tipo invertidos", () => {
  const candidate = structuredClone(gold);
  candidate[3].importe = "89.30";
  candidate[3].tipo = "ingreso";
  const codes = evaluate(source, catalog, schema, candidate).errors.map((error) => error.code);
  assert.ok(codes.includes("IMPORTE"));
  assert.ok(codes.includes("TIPO"));
});

test("rechaza categorías fuera del catálogo", () => {
  const candidate = structuredClone(gold);
  candidate[9].categoria = "marketing";
  assert.ok(evaluate(source, catalog, schema, candidate).errors.some((error) => error.code === "CATEGORIA_FUERA"));
});

test("normaliza DD/MM/YYYY sin intercambiar día y mes", () => {
  assert.equal(normalizeDate("12/06/2026"), "2026-06-12");
  assert.throws(() => normalizeDate("31/02/2026"), /Fecha imposible/);
});

test("el parser conserva comas, saltos y comillas escapadas", () => {
  const rows = [{ a: "uno,dos", b: 'dice "hola"', c: "línea 1\nlínea 2" }];
  assert.deepEqual(parseCsv(toCsv(rows, ["a", "b", "c"])), rows);
});

test("rechaza una descripción que una hoja podría ejecutar como fórmula", () => {
  const candidate = structuredClone(gold);
  candidate[0].descripcion = "=1+1";
  assert.ok(evaluate(source, catalog, schema, candidate).errors.some((error) => error.code === "FORMULA_CSV"));
});
