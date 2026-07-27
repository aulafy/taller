import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { evaluar } from "../lib/evaluacion.mjs";

const archivo = process.argv[2];
if (!archivo) {
  console.error("Uso: node scripts/evaluar.mjs <respuestas.json>");
  process.exit(2);
}

async function json(ruta) {
  return JSON.parse(await readFile(ruta, "utf8"));
}

const resultado = evaluar({
  chunks: await json(new URL("../datos/chunks.json", import.meta.url)),
  casos: await json(new URL("../datos/casos.json", import.meta.url)),
  respuestas: await json(resolve(archivo))
});

console.log(JSON.stringify(resultado, null, 2));
if (!resultado.aprobado) process.exitCode = 1;
