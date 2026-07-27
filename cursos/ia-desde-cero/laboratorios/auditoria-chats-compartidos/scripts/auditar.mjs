import fs from "node:fs";
import { auditInventory } from "../lib/auditoria.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Uso: node scripts/auditar.mjs <inventario.json>");
  process.exit(2);
}

const result = auditInventory(JSON.parse(fs.readFileSync(file, "utf8")));
console.log(JSON.stringify(result.metrics, null, 2));
for (const error of result.errors) console.error(`- ${error}`);
process.exitCode = result.ok ? 0 : 1;
