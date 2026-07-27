const stopwords = new Set([
  "a", "al", "cual", "cuanto", "cuantos", "de", "del", "el", "en", "es", "la", "las",
  "los", "para", "por", "que", "se", "tiene", "un", "una", "y"
]);

export function tokens(texto) {
  return new Set(
    texto
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu)
      ?.filter((token) => token.length > 2 && !stopwords.has(token)) ?? []
  );
}

export function puedeRecuperar(chunk, tenant) {
  return (
    chunk.estado === "publicable" &&
    chunk.riesgo === "ninguno" &&
    (chunk.tenant === "publico" || chunk.tenant === tenant)
  );
}

export function recuperar(pregunta, tenant, chunks, limite = 3) {
  const consulta = tokens(pregunta);
  return chunks
    .filter((chunk) => puedeRecuperar(chunk, tenant))
    .map((chunk) => {
      const documento = tokens(`${chunk.titulo} ${chunk.texto}`);
      const coincidencias = [...consulta].filter((token) => documento.has(token));
      return { id: chunk.id, puntuacion: coincidencias.length, coincidencias };
    })
    .filter((resultado) => resultado.puntuacion > 0)
    .sort((a, b) => b.puntuacion - a.puntuacion || a.id.localeCompare(b.id))
    .slice(0, limite);
}
