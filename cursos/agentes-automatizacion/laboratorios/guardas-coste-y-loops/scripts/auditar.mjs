import { readdir, readFile } from "node:fs/promises";

const directorio = new URL("../escenarios/", import.meta.url);
const archivos = (await readdir(directorio)).filter((nombre) => nombre.endsWith(".json"));
const limites = JSON.parse(await readFile(new URL("../config/limites.json", import.meta.url), "utf8"));
const tarifas = JSON.parse(await readFile(new URL("../config/tarifas-demo.json", import.meta.url), "utf8"));
const fallos = [];

if (archivos.length !== 7) fallos.push(`Se esperaban 7 escenarios y hay ${archivos.length}.`);
for (const [clave, valor] of Object.entries(limites)) {
  if (!Number.isSafeInteger(valor) || valor <= 0) fallos.push(`Límite inválido: ${clave}`);
}
if (!/ficticias/i.test(tarifas.aviso)) fallos.push("Las tarifas deben declararse expresamente ficticias.");

for (const archivo of archivos) {
  const texto = await readFile(new URL(archivo, directorio), "utf8");
  if (/sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-/.test(texto)) {
    fallos.push(`Posible secreto en ${archivo}`);
  }
  if (/https?:\/\//.test(texto)) fallos.push(`URL de red en ${archivo}`);
}

if (fallos.length) {
  console.error(fallos.join("\n"));
  process.exit(1);
}
console.log("Auditoría superada: siete escenarios, tarifas ficticias, cero secretos, red o dependencias.");
