const currentYear = new Date().getFullYear();
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(currentYear);
});

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm instanceof HTMLFormElement) {
  const preview = contactForm.querySelector("[data-request-preview]");
  const summary = contactForm.querySelector("[data-request-summary]");
  const mailtoLink = contactForm.querySelector("[data-mailto-link]");
  const status = contactForm.querySelector("[data-form-status]");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const request = {
      nombre: String(formData.get("nombre") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      organizacion: String(formData.get("organizacion") ?? "").trim(),
      motivo: String(formData.get("motivo") ?? ""),
      canal: String(formData.get("canal") ?? ""),
    };

    const lines = [
      `Nombre: ${request.nombre}`,
      `Correo: ${request.email}`,
      `Organización: ${request.organizacion || "No indicada"}`,
      `Categoría general: ${request.motivo}`,
      `Canal preferido: ${request.canal}`,
      "",
      "No incluyo detalles del asunto ni documentos.",
      "Entiendo que este contacto no crea una relación profesional.",
    ];

    const subject = `Solicitud de orientación · ${request.motivo}`;
    const href = `mailto:orientacion@nexoclarolegal.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;

    if (summary instanceof HTMLElement) summary.textContent = lines.join("\n");
    if (mailtoLink instanceof HTMLAnchorElement) mailtoLink.href = href;
    if (preview instanceof HTMLElement) preview.hidden = false;
    if (status instanceof HTMLElement) status.textContent = "Correo preparado. Revisa el resumen antes de abrir tu aplicación.";
    preview?.scrollIntoView({ block: "nearest" });
  });
}
