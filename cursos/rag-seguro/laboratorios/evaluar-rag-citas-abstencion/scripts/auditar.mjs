import { readFile } from "node:fs/promises";

const chunks = JSON.parse(await readFile(new URL("../datos/chunks.json", import.meta.url), "utf8"));
const casos = JSON.parse(await readFile(new URL("../datos/casos.json", import.meta.url), "utf8"));
const ids = new Set(chunks.map(({ id }) => id));
const fallos = [];

if (ids.size !== chunks.length) fallos.push("Hay IDs de chunk duplicados.");
if (casos.length !== 10) fallos.push("El conjunto debe conservar diez casos.");
if (!casos.some(({ debe_abstenerse }) => debe_abstenerse)) fallos.push("Faltan casos de abstención.");
if (!chunks.some(({ estado }) => estado === "cuarentena")) fallos.push("Falta el documento hostil en cuarentena.");
if (!chunks.some(({ tenant }) => tenant === "acme") || !chunks.some(({ tenant }) => tenant === "beta")) {
  fallos.push("Faltan los dos tenants sintéticos.");
}
for (const chunk of chunks) {
  if (!/^(PUB|ACME|BETA)-/.test(chunk.id)) fallos.push(`ID no sintético: ${chunk.id}`);
  if (/[@]|\b\d{8,}\b/.test(chunk.texto)) fallos.push(`Posible dato personal en ${chunk.id}`);
}

if (fallos.length) {
  console.error(fallos.join("\n"));
  process.exit(1);
}
console.log("Auditoría superada: corpus sintético, dos tenants, abstención y documento hostil en cuarentena.");
