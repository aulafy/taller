const PROVIDERS = new Set(["claude", "chatgpt", "gemini"]);
const CLASSIFICATIONS = new Set(["publico", "interno", "confidencial", "secreto"]);
const STATUSES = new Set(["activo", "revocado"]);
const ACTIONS = new Set(["mantener", "revocar"]);
const SECRET_PATTERN = /(sk-[a-z0-9_-]{8,}|api[_-]?key|bearer\s+[a-z0-9._-]{8,}|password\s*[:=])/i;

function isReservedUrl(value) {
  try {
    return new URL(value).hostname.endsWith(".invalid");
  } catch {
    return false;
  }
}

export function auditInventory(inventory) {
  const errors = [];
  const ids = new Set();
  const rows = Array.isArray(inventory?.enlaces) ? inventory.enlaces : [];

  if (!Array.isArray(inventory?.enlaces)) {
    return { ok: false, errors: ["El campo enlaces debe ser una lista."], metrics: emptyMetrics() };
  }

  for (const [index, row] of rows.entries()) {
    const label = row?.id || `fila ${index + 1}`;

    if (!row?.id || ids.has(row.id)) errors.push(`${label}: identificador ausente o duplicado.`);
    ids.add(row?.id);
    if (!PROVIDERS.has(row?.proveedor)) errors.push(`${label}: proveedor no admitido.`);
    if (!CLASSIFICATIONS.has(row?.clasificacion)) errors.push(`${label}: clasificación no válida.`);
    if (!STATUSES.has(row?.estado)) errors.push(`${label}: estado no válido.`);
    if (!ACTIONS.has(row?.accion)) errors.push(`${label}: acción no válida.`);
    if (!isReservedUrl(row?.url_ficticia)) errors.push(`${label}: usa exclusivamente una URL .invalid ficticia.`);
    if (typeof row?.alcance_comprobado !== "boolean") errors.push(`${label}: falta comprobar el alcance.`);
    if (typeof row?.ventana_privada_comprobada !== "boolean") errors.push(`${label}: falta comprobar en ventana privada.`);
    if (!row?.evidencia || typeof row.evidencia !== "string") errors.push(`${label}: falta evidencia.`);
    if (SECRET_PATTERN.test(JSON.stringify(row))) errors.push(`${label}: parece contener un secreto o contraseña.`);

    const sensitive = row?.clasificacion === "confidencial" || row?.clasificacion === "secreto";
    if (row?.estado === "activo" && sensitive && row?.accion !== "revocar") {
      errors.push(`${label}: un enlace sensible activo debe marcarse para revocación.`);
    }
    if (row?.estado === "activo" && row?.accion === "mantener" &&
        (!row?.alcance_comprobado || !row?.ventana_privada_comprobada)) {
      errors.push(`${label}: no mantengas activo un enlace sin verificar alcance y acceso externo.`);
    }
  }

  const unverified = rows.filter(
    (row) => !row.alcance_comprobado || !row.ventana_privada_comprobada,
  ).length;
  const unsafeAfter = rows.filter(
    (row) =>
      row.estado === "activo" &&
      (row.clasificacion === "confidencial" || row.clasificacion === "secreto") &&
      row.accion !== "revocar",
  ).length;

  return {
    ok: errors.length === 0 && unverified === 0 && unsafeAfter === 0,
    errors,
    metrics: {
      enlaces_encontrados: rows.length,
      enlaces_revisados: rows.length - unverified,
      inseguros_antes: rows.filter(
        (row) =>
          row.estado === "activo" &&
          (row.clasificacion === "confidencial" || row.clasificacion === "secreto"),
      ).length,
      marcados_para_revocar: rows.filter((row) => row.accion === "revocar").length,
      inseguros_despues: unsafeAfter,
      sin_verificar: unverified,
    },
  };
}

function emptyMetrics() {
  return {
    enlaces_encontrados: 0,
    enlaces_revisados: 0,
    inseguros_antes: 0,
    marcados_para_revocar: 0,
    inseguros_despues: 0,
    sin_verificar: 0,
  };
}
