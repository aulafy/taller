import fs from "node:fs";

const documents = JSON.parse(
  fs.readFileSync(
    new URL("../datos/politicas-ficticias.json", import.meta.url),
    "utf8",
  ),
);

function terms(value) {
  const raw = value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .match(/[\p{Letter}\p{Number}]+/gu)
    ?.filter((term) => term.length > 2) ?? [];
  return raw.map((term) => {
    if (term.endsWith("ciones")) return `${term.slice(0, -6)}cion`;
    if (term.endsWith("es") && term.length > 5) return term.slice(0, -2);
    if (term.endsWith("s") && term.length > 4) return term.slice(0, -1);
    return term;
  });
}

export function retrieve(query, limit = 2) {
  if (typeof query !== "string" || query.trim().length < 3) {
    throw new Error("La consulta debe contener al menos 3 caracteres.");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 3) {
    throw new Error("El límite debe ser un entero entre 1 y 3.");
  }

  const queryTerms = new Set(terms(query));
  return documents
    .map((document) => {
      const documentTerms = terms(`${document.titulo} ${document.texto}`);
      const score = documentTerms.reduce(
        (total, term) => total + (queryTerms.has(term) ? 1 : 0),
        0,
      );
      return { ...document, score };
    })
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function renderEvidence(results) {
  return results
    .map((result) => `[${result.id}] ${result.titulo}: ${result.texto}`)
    .join("\n");
}
