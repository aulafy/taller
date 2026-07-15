import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = ["index.html", "areas.html", "proceso.html", "contacto.html", "privacidad.html"];
const publicHtmlFiles = htmlFiles.filter((file) => file !== "privacidad.html");
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
  assert.match(html, /<main[^>]+id="contenido"[^>]+tabindex="-1"/i, `${file}: falta destino enfocable`);
  assert.match(html, /class="demo-banner"[^>]*>[\s\S]{0,190}(fictici|demostración|no es un despacho real|no son operativos)/i, `${file}: falta advertencia visible`);
  assert.match(html, /<nav\s+class="site-nav"\s+aria-label="Navegación principal"/i, `${file}: falta nombre de navegación`);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, `${file}: debe tener un único h1`);

  const localReferences = [...html.matchAll(/(?:href|src)="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter((reference) => !/^(?:#|https?:|mailto:|tel:|data:)/i.test(reference));

  for (const reference of localReferences) {
    const [fileReference] = reference.split("#");
    if (!fileReference) continue;
    assert.ok(fs.existsSync(path.join(root, fileReference)), `${file}: no existe ${reference}`);
  }
}

const index = read("index.html");
assert.match(index, /"@type"\s*:\s*"LegalService"/, "index.html: falta JSON-LD de LegalService");
assert.match(index, /nexoclarolegal\.example/, "index.html: el dominio debe ser inequívocamente ficticio");

const contact = read("contacto.html");
assert.match(contact, /<form[^>]+data-contact-form/i, "contacto.html: falta formulario identificable");
for (const field of ["nombre", "email", "organizacion", "motivo", "canal", "consentimiento"]) {
  assert.match(contact, new RegExp(`<label[^>]+for="${field}"`, "i"), `contacto.html: falta etiqueta de ${field}`);
  assert.match(contact, new RegExp(`<(?:input|select)[^>]+id="${field}"`, "i"), `contacto.html: falta control ${field}`);
}
for (const field of ["nombre", "email", "motivo", "canal", "consentimiento"]) {
  const control = contact.match(new RegExp(`<(?:input|select)[^>]+(?:id="${field}"[^>]*|[^>]+id="${field}")[^>]*>`, "i"));
  assert.ok(control && /\srequired(?:\s|>)/i.test(control[0]), `contacto.html: ${field} debe ser obligatorio`);
}
assert.doesNotMatch(contact, /<textarea\b/i, "contacto.html: no debe pedir un relato libre");
assert.doesNotMatch(contact, /<input[^>]+type="file"/i, "contacto.html: no debe aceptar documentos");

const script = read("assets/app.js");
assert.match(script, /event\.preventDefault\(\)/, "app.js: el formulario no debe enviarse automáticamente");
assert.match(script, /mailto:/, "app.js: falta preparación explícita del correo");
assert.doesNotMatch(script, /\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB)\b/, "app.js: no debe transmitir ni persistir datos");

const sitemap = read("sitemap.xml");
for (const file of publicHtmlFiles) {
  const suffix = file === "index.html" ? "/" : `/${file}`;
  assert.ok(sitemap.includes(`https://nexoclarolegal.example${suffix}`), `sitemap.xml: falta ${file}`);
}
assert.ok(!sitemap.includes("privacidad.html"), "sitemap.xml: privacidad está marcada noindex");

const allContent = htmlFiles.map(read).join("\n");
for (const forbidden of [
  /lorem ipsum/i,
  /casos ganados/i,
  /éxito garantizado/i,
  /clientes satisfechos/i,
  /colegiad[oa]\s+(?:número|nº|núm)/i,
  /sin compromiso/i,
]) {
  assert.doesNotMatch(allContent, forbidden, `Contenido editorial no permitido: ${forbidden}`);
}

console.log(`Caso verificado: ${htmlFiles.length} páginas, rutas, contacto mínimo, metadata y límites editoriales.`);
