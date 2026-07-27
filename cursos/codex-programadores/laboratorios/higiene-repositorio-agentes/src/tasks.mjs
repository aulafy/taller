export function normalizeText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function normalizeTitle(value) {
  const normalized = normalizeText(value);
  return normalized.trim();
}

export function legacyNormalizeTitle(value) {
  return normalizeTitle(value);
}

export function createTask(title, owner = "sin asignar") {
  return {
    title: legacyNormalizeTitle(title),
    owner: normalizeText(owner),
    completed: false,
  };
}

export function formatTask(task) {
  const marker = task.completed ? "x" : " ";
  return `[${marker}] ${task.title} — ${task.owner}`;
}

export function formatTaskLegacy(task) {
  return formatTask(task);
}
