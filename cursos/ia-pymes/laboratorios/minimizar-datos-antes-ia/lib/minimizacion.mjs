const directFields = ["cliente_id", "nombre", "dni", "email", "telefono", "iban", "ciudad"];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function redactText(text, record) {
  let result = text;
  for (const field of directFields) {
    const value = String(record[field] ?? "").trim();
    if (value) result = result.replace(new RegExp(escapeRegExp(value), "gi"), `[${field.toUpperCase()}_RETIRADO]`);
  }
  return result
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL_RETIRADO]")
    .replace(/\+?\d[\d\s-]{7,}\d/g, "[TELEFONO_RETIRADO]")
    .replace(/\b[A-Z]{2}\d{2}[\s-]?[A-Z0-9-]{6,}\b/gi, "[CUENTA_RETIRADA]");
}

export function amountBand(amount) {
  if (amount < 100) return "menos_de_100";
  if (amount < 500) return "100_a_499";
  if (amount < 1000) return "500_a_999";
  return "1000_o_mas";
}

export function minimize(records) {
  const mapping = [];
  const modelInput = records.map((record, index) => {
    const caseId = `CASO-${String(index + 1).padStart(3, "0")}`;
    mapping.push({ caso_id: caseId, cliente_id: record.cliente_id });
    return {
      caso_id: caseId,
      provincia: record.provincia,
      tramo_importe: amountBand(record.importe),
      incidencia_minimizada: redactText(record.incidencia, record),
    };
  });
  return { modelInput, mapping };
}

export function residualAudit(source, modelInput) {
  const output = JSON.stringify(modelInput);
  const leaks = [];
  for (const record of source) {
    for (const field of [...directFields, "edad", "importe"]) {
      const value = String(record[field]);
      if (value && output.includes(value)) leaks.push({ cliente_id: record.cliente_id, field, value });
    }
  }
  const patternLeaks = [
    { type: "email", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
    { type: "telefono", pattern: /\+?\d[\d\s-]{7,}\d/ },
    { type: "dni_demo", pattern: /DEMO-DNI-\d{3}/i },
    { type: "iban_demo", pattern: /ES00-DEMO-\d{4}/i },
  ].filter(({ pattern }) => pattern.test(output)).map(({ type }) => ({ type }));

  return {
    registros_entrada: source.length,
    registros_salida: modelInput.length,
    campos_entrada: Object.keys(source[0] ?? {}).length,
    campos_salida: Object.keys(modelInput[0] ?? {}).length,
    identificadores_directos_residuales: leaks,
    patrones_directos_residuales: patternLeaks,
    advertencia: "Cero coincidencias directas no demuestra anonimización ni elimina el riesgo de reidentificación.",
  };
}

export function toCsv(rows) {
  const fields = Object.keys(rows[0] ?? {});
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  return [fields.map(quote).join(","), ...rows.map((row) => fields.map((field) => quote(row[field])).join(","))].join("\n") + "\n";
}
