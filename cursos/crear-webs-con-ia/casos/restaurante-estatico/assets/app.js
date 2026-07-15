const currentYear = new Date().getFullYear();
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(currentYear);
});

const reservationForm = document.querySelector("[data-reservation-form]");

if (reservationForm instanceof HTMLFormElement) {
  const dateInput = reservationForm.elements.namedItem("fecha");
  const messageInput = reservationForm.elements.namedItem("mensaje");
  const messageCount = reservationForm.querySelector("[data-message-count]");
  const preview = reservationForm.querySelector("[data-request-preview]");
  const summary = reservationForm.querySelector("[data-request-summary]");
  const mailtoLink = reservationForm.querySelector("[data-mailto-link]");
  const status = reservationForm.querySelector("[data-form-status]");

  if (dateInput instanceof HTMLInputElement) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = localToday;
  }

  if (messageInput instanceof HTMLTextAreaElement && messageCount instanceof HTMLOutputElement) {
    messageInput.addEventListener("input", () => {
      messageCount.value = String(messageInput.value.length);
    });
  }

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!reservationForm.reportValidity()) return;

    const formData = new FormData(reservationForm);
    const request = {
      nombre: String(formData.get("nombre") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      fecha: String(formData.get("fecha") ?? ""),
      turno: String(formData.get("turno") ?? ""),
      personas: String(formData.get("personas") ?? ""),
      mensaje: String(formData.get("mensaje") ?? "").trim(),
    };

    const lines = [
      `Nombre: ${request.nombre}`,
      `Correo: ${request.email}`,
      `Fecha solicitada: ${request.fecha}`,
      `Turno: ${request.turno}`,
      `Personas: ${request.personas}`,
      `Nota: ${request.mensaje || "Sin nota"}`,
      "",
      "Sé que esta solicitud no confirma disponibilidad.",
    ];

    const subject = `Solicitud de mesa · ${request.fecha} · ${request.personas} personas`;
    const href = `mailto:reservas@lumbreyoliva.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;

    if (summary instanceof HTMLElement) summary.textContent = lines.join("\n");
    if (mailtoLink instanceof HTMLAnchorElement) mailtoLink.href = href;
    if (preview instanceof HTMLElement) preview.hidden = false;
    if (status instanceof HTMLElement) status.textContent = "Solicitud preparada. Revísala antes de abrir el correo.";
    preview?.scrollIntoView({ block: "nearest" });
  });
}
