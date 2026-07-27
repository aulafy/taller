import { readFile } from "node:fs/promises";
import { coincideEsperado, evaluarEscenario } from "../lib/politica.mjs";

const base = new URL("../", import.meta.url);
const politica = JSON.parse(await readFile(new URL("config/politica.json", base)));
const escenarios = JSON.parse(await readFile(new URL("datos/escenarios.json", base)));

const informe = escenarios.map((escenario) => {
  const resultado = evaluarEscenario(escenario, politica);
  return {
    id: escenario.id,
    coincide: coincideEsperado(resultado, escenario.esperado),
    decision: resultado.decision,
    motivo: resultado.motivo,
  };
});

console.log(JSON.stringify(informe, null, 2));
if (informe.some((caso) => !caso.coincide)) process.exitCode = 1;
