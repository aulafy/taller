import fs from "node:fs";
import path from "node:path";

const target = process.argv[2];
if (!target) {
  console.error("Uso: node scripts/auditar-higiene.mjs <archivo>");
  process.exit(2);
}

const source = fs.readFileSync(target, "utf8");
const exportedFunctions = source.match(/^export function /gm)?.length ?? 0;
const forbidden = ["legacyNormalizeTitle", "formatTaskLegacy", "normalizeTitle"];
const findings = forbidden.filter((name) => source.includes(name));

if (findings.length > 0 || exportedFunctions > 3) {
  console.error(`Auditoría no superada en ${path.normalize(target)}.`);
  if (findings.length > 0) console.error(`Wrappers redundantes: ${findings.join(", ")}.`);
  if (exportedFunctions > 3) console.error(`API exportada: ${exportedFunctions} funciones; máximo esperado: 3.`);
  process.exit(1);
}

console.log(`Auditoría superada: ${path.normalize(target)} conserva 3 funciones públicas y ningún wrapper legado.`);
