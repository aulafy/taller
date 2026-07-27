import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { contienePatronSimple, evaluarEscenario } from "../lib/politica.mjs";

const base = new URL("../", import.meta.url);
const politica = JSON.parse(await readFile(new URL("config/politica.json", base)));
const escenarios = JSON.parse(await readFile(new URL("datos/escenarios.json", base)));
const caso = (id) => escenarios.find((escenario) => escenario.id === id);
const evaluar = (id) => evaluarEscenario(caso(id), politica);

test("permite resumir datos no confiables sin producir efectos", () => {
  assert.deepEqual(
    {...evaluar("resumen-pdf-benigno"), detalle: null},
    {
      id: "resumen-pdf-benigno",
      decision: "permitir",
      motivo: "sin_efecto",
      detalle: null,
    },
  );
});

test("bloquea tools que el usuario no incluyó en el contrato", () => {
  for (const id of [
    "pdf-intenta-enviar-secreto",
    "web-intenta-publicar",
    "celda-cambia-iban",
    "resultado-tool-envenenado",
  ]) {
    assert.equal(evaluar(id).motivo, "tool_fuera_del_contrato");
  }
});

test("una aprobación no convierte contenido externo en autoridad", () => {
  const resultado = evaluar("ofuscacion-sin-palabras-prohibidas");
  assert.equal(resultado.decision, "bloquear");
  assert.equal(resultado.motivo, "contenido_no_confiable_a_efecto");
});

test("el ejemplo ofuscado evade el filtro simple de palabras", () => {
  const texto = caso("ofuscacion-sin-palabras-prohibidas").fuentes[0].contenido;
  assert.equal(contienePatronSimple(texto), false);
  assert.equal(evaluar("ofuscacion-sin-palabras-prohibidas").decision, "bloquear");
});

test("pide aprobación para un efecto legítimo de alto riesgo", () => {
  assert.equal(evaluar("correo-legitimo-sin-aprobar").decision, "pedir_aprobacion");
});

test("permite el mismo efecto cuando contrato, destino y aprobación coinciden", () => {
  assert.equal(evaluar("correo-legitimo-aprobado").decision, "permitir");
});

test("la aprobación no permite cambiar el destino", () => {
  const resultado = evaluar("destino-cambiado");
  assert.equal(resultado.decision, "bloquear");
  assert.equal(resultado.motivo, "destino_no_autorizado");
});

test("bloquea una tool desconocida", () => {
  const escenario = structuredClone(caso("resumen-pdf-benigno"));
  escenario.propuesta.tool = "tool_instalada_despues";
  assert.equal(evaluarEscenario(escenario, politica).motivo, "tool_desconocida");
});

test("bloquea una procedencia que no existe en la traza", () => {
  const escenario = structuredClone(caso("resumen-pdf-benigno"));
  escenario.propuesta.influida_por = ["fuente-inexistente"];
  assert.equal(evaluarEscenario(escenario, politica).motivo, "procedencia_desconocida");
});
