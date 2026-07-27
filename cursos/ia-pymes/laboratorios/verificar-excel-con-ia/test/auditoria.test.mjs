import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { auditSales, readSales } from "../lib/auditoria.mjs";

const source = new URL("../datos/ventas-sinteticas.csv", import.meta.url);

test("reconcilia las 12 filas con el resultado patrón", () => {
  const result = auditSales(readSales(source));
  assert.equal(result.rows, 12);
  assert.equal(result.verifiedSales, 4024);
  assert.equal(result.verifiedMargin, 2434);
});

test("detecta los tres descuentos omitidos por la propuesta", () => {
  const result = auditSales(readSales(source));
  assert.deepEqual(
    result.reviewed.filter((row) => row.silentError).map((row) => row.id),
    ["DEMO-002", "DEMO-005", "DEMO-009"],
  );
});

test("detecta que el total propuesto omite la última fila", () => {
  const result = auditSales(readSales(source));
  assert.equal(result.proposedRangeMissingLast, 3960);
  assert.equal(result.totalDifference, -64);
});

test("un caso sin descuento coincide sin demostrar que toda la fórmula sea correcta", () => {
  const result = auditSales(readSales(source));
  const easy = result.reviewed.find((row) => row.id === "DEMO-001");
  assert.equal(easy.proposedSales, easy.verifiedSales);
  assert.equal(easy.silentError, false);
});

test("el conjunto utiliza identificadores sintéticos y no contiene secretos", () => {
  const text = fs.readFileSync(source, "utf8");
  assert.doesNotMatch(text, /sk-[a-z0-9_-]{8,}|api[_-]?key|password|bearer\s+/i);
  for (const row of readSales(source)) assert.match(row.id, /^DEMO-\d{3}$/);
});
