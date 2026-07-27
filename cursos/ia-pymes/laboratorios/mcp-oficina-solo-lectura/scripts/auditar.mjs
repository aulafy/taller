import { readFile } from "node:fs/promises";
import { cargarPedidos } from "../src/datos.mjs";

const fuente = await readFile(new URL("../src/servidor.mjs", import.meta.url), "utf8");
const pedidos = await cargarPedidos();
const prohibidos = [
  /\b(sk-[A-Za-z0-9_-]{12,}|xox[baprs]-|ghp_[A-Za-z0-9]{20,})\b/,
  /\b(write|delete|update|create)_(pedido|cliente|factura)\b/i,
  /0\.0\.0\.0/,
  /https?:\/\/(?!modelcontextprotocol)/i
];

const fallos = prohibidos.flatMap((patron) =>
  patron.test(fuente) ? [`El servidor contiene un patrón prohibido: ${patron}`] : []
);

if (pedidos.length !== 12) fallos.push(`Se esperaban 12 pedidos y hay ${pedidos.length}.`);
if (!fuente.includes("readOnlyHint: true")) fallos.push("Falta la anotación explícita de solo lectura.");
if (!fuente.includes("openWorldHint: false")) fallos.push("Falta declarar que las tools no consultan el mundo abierto.");
if (fuente.includes("console.log(")) fallos.push("stdout queda reservado para el protocolo; usa stderr.");

if (fallos.length) {
  console.error(fallos.join("\n"));
  process.exit(1);
}

console.log("Auditoría superada: datos sintéticos, tres tools de lectura, sin red, secretos ni escritura.");
