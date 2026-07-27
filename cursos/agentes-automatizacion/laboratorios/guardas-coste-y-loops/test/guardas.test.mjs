import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { costeReal, costeReservado, ejecutarEscenario, fingerprint } from "../lib/guardas.mjs";

async function json(ruta) {
  return JSON.parse(await readFile(new URL(ruta, import.meta.url), "utf8"));
}

const limites = await json("../config/limites.json");
const tarifas = await json("../config/tarifas-demo.json");

async function ejecutar(nombre) {
  return ejecutarEscenario(await json(`../escenarios/${nombre}.json`), limites, tarifas);
}

test("normaliza los argumentos antes de crear el fingerprint", () => {
  const base = { tipo: "tool", tool: "consultar_crm", intencion: " Consultar   estado " };
  assert.equal(
    fingerprint({ ...base, args: { cliente_id: "1", limite: 2 } }),
    fingerprint({ ...base, args: { limite: 2, cliente_id: "1" } })
  );
});

test("reserva el máximo antes y reconcilia el uso real después", () => {
  const accion = {
    tipo: "modelo", modelo: "modelo-demo",
    entrada_estimada: 1000, salida_maxima: 200,
    entrada_real: 800, salida_real: 100
  };
  assert.equal(costeReservado(accion, tarifas), 1800);
  assert.equal(costeReal(accion, tarifas), 1200);
});

test("permite terminar el escenario sano", async () => {
  const resultado = await ejecutar("sano");
  assert.equal(resultado.estado, "completado");
  assert.equal(resultado.coste_microusd, 4200);
});

test("detiene la tercera repetición antes de ejecutarla", async () => {
  const resultado = await ejecutar("loop-fingerprint");
  assert.equal(resultado.motivo, "fingerprint_repetido");
  assert.equal(resultado.pasos_ejecutados, 2);
});

test("reserva presupuesto antes de llamar al modelo", async () => {
  const resultado = await ejecutar("presupuesto");
  assert.equal(resultado.motivo, "presupuesto_reservado");
  assert.equal(resultado.coste_microusd, 1200);
  assert.equal(resultado.coste_reservado_evitable, 7000);
});

test("aplica cuota individual por herramienta", async () => {
  assert.equal((await ejecutar("cuota-tool")).motivo, "cuota_tool");
});

test("aplica límites de pasos y tiempo", async () => {
  assert.equal((await ejecutar("max-pasos")).motivo, "max_pasos");
  assert.equal((await ejecutar("timeout")).motivo, "runtime");
});

test("detiene actividad que consume sin aportar progreso", async () => {
  assert.equal((await ejecutar("sin-progreso")).motivo, "sin_progreso");
});
