export function normalizeText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function createTask(title, owner = "sin asignar") {
  return {
    title: normalizeText(title),
    owner: normalizeText(owner),
    completed: false,
  };
}

export function formatTask(task) {
  const marker = task.completed ? "x" : " ";
  return `[${marker}] ${task.title} — ${task.owner}`;
}
