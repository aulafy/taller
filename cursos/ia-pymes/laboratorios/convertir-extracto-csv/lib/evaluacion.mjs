const FORMULA_PREFIX = /^[\s]*[=+\-@]/;

export function normalizeDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) throw new Error(`Fecha no declarada como DD/MM/YYYY: ${value}`);
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() + 1 !== Number(month) ||
    date.getUTCDate() !== Number(day)
  ) throw new Error(`Fecha imposible: ${value}`);
  return `${year}-${month}-${day}`;
}

export function cents(value) {
  const text = String(value);
  if (!/^-?\d+\.\d{2}$/.test(text)) throw new Error(`Importe sin dos decimales: ${text}`);
  return Math.round(Number(text) * 100);
}

export function buildGold(source, catalog) {
  return source.map((row) => ({
    movimiento_id: row.id,
    fecha_iso: normalizeDate(row.fecha),
    descripcion: row.concepto,
    categoria: catalog.categoria_por_movimiento[row.id],
    tipo: row.importe >= 0 ? "ingreso" : "gasto",
    importe: row.importe.toFixed(2),
  }));
}

export function evaluate(source, catalog, schema, candidate) {
  const errors = [];
  const expectedColumns = schema.columnas;
  const sourceById = new Map(source.map((row) => [row.id, row]));
  const seen = new Set();

  for (const [index, row] of candidate.entries()) {
    const label = row.movimiento_id || `fila ${index + 2}`;
    const columns = Object.keys(row);
    if (columns.join("|") !== expectedColumns.join("|")) errors.push({ code: "ESQUEMA", row: label, detail: "Columnas ausentes, adicionales o desordenadas." });
    if (seen.has(row.movimiento_id)) errors.push({ code: "DUPLICADO", row: label, detail: "El ID aparece más de una vez." });
    seen.add(row.movimiento_id);
    const original = sourceById.get(row.movimiento_id);
    if (!original) {
      errors.push({ code: "INVENTADO", row: label, detail: "No existe en el origen." });
      continue;
    }
    if (row.fecha_iso !== normalizeDate(original.fecha)) errors.push({ code: "FECHA", row: label, detail: "La fecha ISO no conserva el día y mes declarados." });
    if (row.descripcion !== original.concepto) errors.push({ code: "DESCRIPCION", row: label, detail: "El concepto fue alterado." });
    if (FORMULA_PREFIX.test(row.descripcion)) errors.push({ code: "FORMULA_CSV", row: label, detail: "El texto podría interpretarse como fórmula al abrirse en una hoja." });
    if (!catalog.categorias_permitidas.includes(row.categoria)) errors.push({ code: "CATEGORIA_FUERA", row: label, detail: "La categoría no pertenece al catálogo." });
    if (row.categoria !== catalog.categoria_por_movimiento[row.movimiento_id]) errors.push({ code: "CATEGORIA", row: label, detail: "La categoría no coincide con el criterio patrón." });
    const expectedType = original.importe >= 0 ? "ingreso" : "gasto";
    if (row.tipo !== expectedType) errors.push({ code: "TIPO", row: label, detail: `Debe ser ${expectedType}.` });
    try {
      if (cents(row.importe) !== Math.round(original.importe * 100)) errors.push({ code: "IMPORTE", row: label, detail: "Importe o signo diferente al origen." });
    } catch (error) {
      errors.push({ code: "IMPORTE_FORMATO", row: label, detail: error.message });
    }
  }

  for (const row of source) {
    if (!seen.has(row.id)) errors.push({ code: "AUSENTE", row: row.id, detail: "No aparece en la salida." });
  }

  const inputTotal = source.reduce((total, row) => total + Math.round(row.importe * 100), 0);
  let outputTotal = 0;
  for (const row of candidate) {
    try { outputTotal += cents(row.importe); } catch { /* ya informado */ }
  }
  if (inputTotal !== outputTotal) errors.push({ code: "NO_CONCILIA", row: "TOTAL", detail: `Origen ${inputTotal} céntimos; salida ${outputTotal} céntimos.` });

  return {
    ok: errors.length === 0,
    metrics: {
      filas_origen: source.length,
      filas_salida: candidate.length,
      total_origen_centimos: inputTotal,
      total_salida_centimos: outputTotal,
      diferencia_centimos: outputTotal - inputTotal,
      errores: errors.length,
    },
    errors,
  };
}
