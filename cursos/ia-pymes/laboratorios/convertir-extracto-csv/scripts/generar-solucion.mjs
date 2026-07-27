import fs from "node:fs";
import { buildGold } from "../lib/evaluacion.mjs";
import { toCsv } from "../lib/csv.mjs";

const source = JSON.parse(fs.readFileSync(new URL("../datos/extracto-sintetico.json", import.meta.url), "utf8"));
const catalog = JSON.parse(fs.readFileSync(new URL("../datos/catalogo.json", import.meta.url), "utf8"));
const schema = JSON.parse(fs.readFileSync(new URL("../datos/esquema.json", import.meta.url), "utf8"));
fs.writeFileSync(new URL("../solucion/importacion.csv", import.meta.url), toCsv(buildGold(source, catalog), schema.columnas));
console.log("Solución generada desde el origen y el catálogo.");
