import fs from "node:fs";

const audit = JSON.parse(fs.readFileSync(new URL("../salida/auditoria.json", import.meta.url), "utf8"));
const csv = fs.readFileSync(new URL("../salida/entrada-modelo.csv", import.meta.url), "utf8");
const mapPath = new URL("../salida/mapa-local.json", import.meta.url);
const mode = fs.statSync(mapPath).mode & 0o777;

const forbidden = /CLIENTE-DEMO|DEMO-DNI|ES00-DEMO|example\.invalid|\+34 600|Lucía|Mateo|Sara|Hugo|Noa|Leo|Emma|Daniel/i;
if (
  audit.registros_entrada !== 8 ||
  audit.registros_salida !== 8 ||
  audit.campos_entrada !== 11 ||
  audit.campos_salida !== 4 ||
  audit.identificadores_directos_residuales.length !== 0 ||
  audit.patrones_directos_residuales.length !== 0 ||
  forbidden.test(csv) ||
  mode !== 0o600
) {
  console.error("La salida no cumple el contrato de minimización del laboratorio.");
  process.exit(1);
}
console.log("Salida verificada: 8 casos, 4 campos, 0 coincidencias directas y mapa local con permisos 600.");
