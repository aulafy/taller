import { readdir, readFile } from "node:fs/promises";
import { ejecutarEscenario, coincideEsperado } from "../lib/guardas.mjs";

async function json(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

const limites = await json(new URL("../config/limites.json", import.meta.url));
const tarifas = await json(new URL("../config/tarifas-demo.json", import.meta.url));
const directorio = new URL("../escenarios/", import.meta.url);
const archivos = (await readdir(directorio)).filter((nombre) => nombre.endsWith(".json")).sort();
const resultados = [];

for (const archivo of archivos) {
  const escenario = await json(new URL(archivo, directorio));
  const resultado = ejecutarEscenario(escenario, limites, tarifas);
  resultados.push({
    escenario: escenario.id,
    coincide: coincideEsperado(resultado, escenario.esperado),
    estado: resultado.estado,
    motivo: resultado.motivo,
    pasos_ejecutados: resultado.pasos_ejecutados,
    coste_microusd: resultado.coste_microusd,
    coste_reservado_evitable: resultado.coste_reservado_evitable
  });
}

console.log(JSON.stringify(resultados, null, 2));
if (resultados.some(({ coincide }) => !coincide)) process.exitCode = 1;
