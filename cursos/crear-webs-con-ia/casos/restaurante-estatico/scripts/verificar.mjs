import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = ["index.html", "carta.html", "visita.html", "privacidad.html"];
const requiredFiles = [
  ...htmlFiles,
  "README.md",
  "AGENTS.md",
  "LICENSE",
  "assets/styles.css",
  "assets/app.js",
  "docs/BRIEF.md",
  "docs/PRUEBAS.md",
  "docs/VERIFICADO.md",
  "robots.txt",
  "sitemap.xml",
];

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

for (const file of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, file)), `Falta ${file}`);
}

for (const file of htmlFiles) {
  const html = read(file);
  assert.match(html, /<html\s+lang="es">/i, `${file}: falta lang="es"`);
  assert.match(html, /<meta\s+name="viewport"/i, `${file}: falta viewport`);
  assert.match(html, /<meta\s+name="description"/i, `${file}: falta descripción`);
  assert.match(html, /<link\s+rel="canonical"/i, `${file}: falta canonical`);
  assert.match(html, /class="skip-link"[^>]+href="#contenido"/i, `${file}: falta enlace de salto`);
  assert.match(html, /<main[^>]+id="contenido"[^>]+tabindex="-1"/i, `${file}: falta un destino enfocable para el enlace de salto`);
  assert.match(html, /class="demo-banner"[^>]*>[\s\S]{0,180}(fictici|no operativ|prototipo|negocio real)/i, `${file}: debe advertir que es una demostración`);
  assert.match(html, /<nav\s+aria-label="Navegación principal"/i, `${file}: falta nombre de la navegación`);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, `${file}: debe tener un único h1`);

  const localReferences = [...html.matchAll(/(?:href|src)="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter((reference) => !/^(?:#|https?:|mailto:|tel:|data:)/i.test(reference));

  for (const reference of localReferences) {
    const [fileReference] = reference.split("#");
    if (!fileReference) continue;
    assert.ok(fs.existsSync(path.join(root, fileReference)), `${file}: no existe la ruta ${reference}`);
  }
}

const index = read("index.html");
assert.match(index, /"@type"\s*:\s*"Restaurant"/, "index.html: falta JSON-LD de Restaurant");

const visit = read("visita.html");
assert.match(visit, /<form[^>]+data-reservation-form/i, "visita.html: falta el formulario identificable");
for (const field of ["nombre", "email", "fecha", "turno", "personas", "mensaje"]) {
  assert.match(visit, new RegExp(`<label[^>]+for="${field}"`, "i"), `visita.html: falta la etiqueta de ${field}`);
  assert.match(visit, new RegExp(`<(?:input|select|textarea)[^>]+id="${field}"`, "i"), `visita.html: falta el control ${field}`);
}
for (const field of ["nombre", "email", "fecha", "turno", "personas"]) {
  const control = visit.match(new RegExp(`<(?:input|select)[^>]+(?:id="${field}"[^>]*|[^>]+id="${field}")[^>]*>`, "i"));
  assert.ok(control && /\srequired(?:\s|>)/i.test(control[0]), `visita.html: ${field} debe ser obligatorio`);
}

const script = read("assets/app.js");
assert.match(script, /event\.preventDefault\(\)/, "app.js: el formulario no debe enviarse automáticamente");
assert.match(script, /mailto:/, "app.js: falta la preparación explícita del correo");
assert.doesNotMatch(script, /\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage)\b/, "app.js: no debe transmitir ni persistir datos");

const sitemap = read("sitemap.xml");
for (const file of htmlFiles.filter((file) => file !== "privacidad.html")) {
  const suffix = file === "index.html" ? "/" : `/${file}`;
  assert.ok(sitemap.includes(`https://lumbreyoliva.example${suffix}`), `sitemap.xml: falta ${file}`);
}

const allContent = htmlFiles.map(read).join("\n");
for (const forbidden of [/lorem ipsum/i, /mejor restaurante/i, /clientes satisfechos/i, /reseñas? verificadas?/i]) {
  assert.doesNotMatch(allContent, forbidden, `Contenido editorial no permitido: ${forbidden}`);
}

console.log(`Caso verificado: ${htmlFiles.length} páginas, rutas locales, formulario, metadata y límites editoriales.`);
