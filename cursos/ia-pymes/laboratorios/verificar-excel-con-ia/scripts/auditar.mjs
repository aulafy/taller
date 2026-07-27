import { auditSales, readSales } from "../lib/auditoria.mjs";

const result = auditSales(readSales(new URL("../datos/ventas-sinteticas.csv", import.meta.url)));
console.log(JSON.stringify({
  filas_revisadas: result.rows,
  errores_silenciosos_detectados: result.silentErrors,
  ventas_verificadas: result.verifiedSales,
  margen_verificado: result.verifiedMargin,
  total_propuesto_con_rango_corto: result.proposedRangeMissingLast,
  diferencia_total: result.totalDifference,
}, null, 2));

if (
  result.rows !== 12 ||
  result.silentErrors !== 3 ||
  result.verifiedSales !== 4024 ||
  result.verifiedMargin !== 2434 ||
  result.totalDifference !== -64
) {
  console.error("La evidencia no coincide con el caso patrón.");
  process.exitCode = 1;
}
