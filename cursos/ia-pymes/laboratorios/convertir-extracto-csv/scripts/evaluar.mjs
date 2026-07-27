import fs from "node:fs";
import { parseCsv } from "../lib/csv.mjs";
import { evaluate } from "../lib/evaluacion.mjs";

const candidatePath = process.argv[2];
if (!candidatePath) {
  console.error("Uso: node scripts/evaluar.mjs <archivo.csv>");
  process.exit(2);
}
const readJson = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));
const result = evaluate(
  readJson("../datos/extracto-sintetico.json"),
  readJson("../datos/catalogo.json"),
  readJson("../datos/esquema.json"),
  parseCsv(fs.readFileSync(candidatePath, "utf8")),
);
console.log(JSON.stringify(result.metrics, null, 2));
for (const error of result.errors) console.error(`- ${error.code} · ${error.row}: ${error.detail}`);
process.exitCode = result.ok ? 0 : 1;
