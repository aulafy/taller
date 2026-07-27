import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { amountBand, minimize, redactText, residualAudit } from "../lib/minimizacion.mjs";

const source = JSON.parse(fs.readFileSync(new URL("../datos/solicitudes-sinteticas.json", import.meta.url), "utf8"));

test("reduce once campos de entrada a cuatro campos necesarios", () => {
  const { modelInput } = minimize(source);
  assert.deepEqual(Object.keys(modelInput[0]), ["caso_id", "provincia", "tramo_importe", "incidencia_minimizada"]);
});

test("retira identificadores directos también del texto libre", () => {
  const { modelInput } = minimize(source);
  const audit = residualAudit(source, modelInput);
  assert.deepEqual(audit.identificadores_directos_residuales, []);
  assert.deepEqual(audit.patrones_directos_residuales, []);
});

test("generaliza importes exactos por tramos declarados", () => {
  assert.equal(amountBand(82.45), "menos_de_100");
  assert.equal(amountBand(310), "100_a_499");
  assert.equal(amountBand(760.2), "500_a_999");
  assert.equal(amountBand(1250), "1000_o_mas");
});

test("separa el identificador operativo del identificador original", () => {
  const { modelInput, mapping } = minimize(source);
  assert.equal(modelInput[0].caso_id, "CASO-001");
  assert.equal(mapping[0].cliente_id, "CLIENTE-DEMO-001");
  assert.doesNotMatch(JSON.stringify(modelInput), /CLIENTE-DEMO/);
});

test("el redactor no altera una incidencia que no contiene identificadores", () => {
  const record = source[2];
  assert.equal(redactText(record.incidencia, record), record.incidencia);
});

test("la auditoría conserva la advertencia sobre reidentificación", () => {
  const { modelInput } = minimize(source);
  assert.match(residualAudit(source, modelInput).advertencia, /no demuestra anonimización/i);
});
