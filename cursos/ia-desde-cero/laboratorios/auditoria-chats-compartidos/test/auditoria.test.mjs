import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { auditInventory } from "../lib/auditoria.mjs";

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));

test("la solución no deja enlaces inseguros ni pendientes", () => {
  const result = auditInventory(read("../solucion/inventario.json"));
  assert.equal(result.ok, true);
  assert.equal(result.metrics.sin_verificar, 0);
  assert.equal(result.metrics.inseguros_despues, 0);
});

test("el inventario inicial detecta exposición y falta de verificación", () => {
  const result = auditInventory(read("../datos/inventario-inicial.json"));
  assert.equal(result.ok, false);
  assert.equal(result.metrics.sin_verificar, 1);
  assert.match(result.errors.join("\n"), /revocación|verificar/);
});

test("rechaza una URL real", () => {
  const inventory = read("../solucion/inventario.json");
  inventory.enlaces[0].url_ficticia = "https://example.com/share/real";
  assert.match(auditInventory(inventory).errors.join("\n"), /\.invalid/);
});

test("rechaza identificadores duplicados", () => {
  const inventory = read("../solucion/inventario.json");
  inventory.enlaces[1].id = inventory.enlaces[0].id;
  assert.match(auditInventory(inventory).errors.join("\n"), /duplicado/);
});

test("rechaza valores con apariencia de secreto", () => {
  const inventory = read("../solucion/inventario.json");
  inventory.enlaces[0].evidencia = "password=valor-que-no-debe-estar";
  assert.match(auditInventory(inventory).errors.join("\n"), /secreto/);
});
