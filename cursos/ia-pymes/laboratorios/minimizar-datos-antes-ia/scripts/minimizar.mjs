import fs from "node:fs";
import { minimize, residualAudit, toCsv } from "../lib/minimizacion.mjs";

const source = JSON.parse(fs.readFileSync(new URL("../datos/solicitudes-sinteticas.json", import.meta.url), "utf8"));
const { modelInput, mapping } = minimize(source);
const audit = residualAudit(source, modelInput);
const outputDir = new URL("../salida/", import.meta.url);
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(new URL("entrada-modelo.csv", outputDir), toCsv(modelInput));
fs.writeFileSync(new URL("mapa-local.json", outputDir), JSON.stringify(mapping, null, 2) + "\n", { mode: 0o600 });
fs.writeFileSync(new URL("auditoria.json", outputDir), JSON.stringify(audit, null, 2) + "\n");
console.log(JSON.stringify(audit, null, 2));
