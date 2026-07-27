import { readFile } from "node:fs/promises";

const ESTADOS = ["pendiente", "preparacion", "enviado", "entregado", "incidencia"];
const rutaDatos = new URL("../datos/pedidos-sinteticos.json", import.meta.url);

export async function cargarPedidos() {
  const pedidos = JSON.parse(await readFile(rutaDatos, "utf8"));
  if (!Array.isArray(pedidos)) throw new Error("El conjunto de pedidos no es una lista.");

  const ids = new Set();
  for (const pedido of pedidos) {
    if (!/^PED-DEMO-\d{3}$/.test(pedido.id)) throw new Error(`ID no sintético: ${pedido.id}`);
    if (ids.has(pedido.id)) throw new Error(`ID duplicado: ${pedido.id}`);
    if (!ESTADOS.includes(pedido.estado)) throw new Error(`Estado no permitido: ${pedido.estado}`);
    if (!Number.isSafeInteger(pedido.importe_cents) || pedido.importe_cents < 0) {
      throw new Error(`Importe inválido: ${pedido.id}`);
    }
    ids.add(pedido.id);
  }
  return Object.freeze(pedidos.map((pedido) => Object.freeze({ ...pedido })));
}

export { ESTADOS };
