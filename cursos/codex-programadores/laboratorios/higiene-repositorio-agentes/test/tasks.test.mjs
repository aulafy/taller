import test from "node:test";
import assert from "node:assert/strict";

const variant = process.env.AULAFY_TASKS_MODULE === "solucion" ? "../solucion/tasks.mjs" : "../src/tasks.mjs";
const { createTask, formatTask, normalizeText } = await import(variant);

test("normaliza espacios y valores ausentes", () => {
  assert.equal(normalizeText("  informe   mensual  "), "informe mensual");
  assert.equal(normalizeText(null), "");
});

test("crea una tarea con valores normalizados", () => {
  assert.deepEqual(createTask("  Revisar   factura ", "  Ana  "), {
    title: "Revisar factura",
    owner: "Ana",
    completed: false,
  });
});

test("formatea tareas pendientes y completadas", () => {
  const task = createTask("Preparar demo", "Equipo");
  assert.equal(formatTask(task), "[ ] Preparar demo — Equipo");
  assert.equal(formatTask({ ...task, completed: true }), "[x] Preparar demo — Equipo");
});
