import { readFile, readdir } from "node:fs/promises";

const raiz = new URL("../", import.meta.url);
const escenarios = JSON.parse(await readFile(new URL("datos/escenarios.json", raiz)));
const politica = JSON.parse(await readFile(new URL("config/politica.json", raiz)));
const archivos = await readdir(raiz, {recursive: true});

if (escenarios.length !== 9) throw new Error("Deben existir nueve escenarios.");
if (new Set(escenarios.map(({id}) => id)).size !== escenarios.length) {
  throw new Error("Los IDs de escenario deben ser únicos.");
}
if (!politica.dominios_externos_permitidos.every((dominio) => dominio.endsWith(".example"))) {
  throw new Error("La allowlist solo puede contener dominios reservados .example.");
}
if (Object.values(politica.herramientas).some(({efecto, riesgo}) => !efecto || !riesgo)) {
  throw new Error("Cada herramienta necesita efecto y riesgo.");
}

const texto = (
  await Promise.all(
    archivos
      .filter((ruta) => /\.(json|md|mjs)$/.test(ruta))
      .map((ruta) => readFile(new URL(ruta, raiz), "utf8")),
  )
).join("\n");
const secretos = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /xai-[A-Za-z0-9_-]{20,}/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /BEGIN (RSA|OPENSSH|EC) PRIVATE KEY/,
];
if (secretos.some((patron) => patron.test(texto))) {
  throw new Error("Posible secreto real detectado.");
}

console.log(
  "Auditoría superada: nueve escenarios sintéticos, dominios reservados, cero secretos, red o dependencias.",
);
