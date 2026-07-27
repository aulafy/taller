import { createHash } from "node:crypto";

function jsonEstable(valor) {
  if (Array.isArray(valor)) return `[${valor.map(jsonEstable).join(",")}]`;
  if (valor && typeof valor === "object") {
    return `{${Object.keys(valor).sort().map((clave) => `${JSON.stringify(clave)}:${jsonEstable(valor[clave])}`).join(",")}}`;
  }
  return JSON.stringify(valor);
}

export function fingerprint(accion) {
  if (accion.tipo !== "tool") return null;
  const base = jsonEstable({
    intencion: accion.intencion.trim().toLowerCase().replace(/\s+/g, " "),
    tool: accion.tool,
    args: accion.args
  });
  return createHash("sha256").update(base).digest("hex").slice(0, 16);
}

export function costeReservado(accion, tarifas) {
  if (accion.tipo === "tool") {
    const tarifa = tarifas.tools[accion.tool];
    if (!tarifa) throw new Error(`Tool sin tarifa configurada: ${accion.tool}`);
    return tarifa.coste_microusd_por_llamada;
  }
  const tarifa = tarifas.modelos[accion.modelo];
  if (!tarifa) throw new Error(`Modelo sin tarifa configurada: ${accion.modelo}`);
  return (
    accion.entrada_estimada * tarifa.entrada_microusd_por_token +
    accion.salida_maxima * tarifa.salida_microusd_por_token
  );
}

export function costeReal(accion, tarifas) {
  if (accion.tipo === "tool") return costeReservado(accion, tarifas);
  const tarifa = tarifas.modelos[accion.modelo];
  return (
    accion.entrada_real * tarifa.entrada_microusd_por_token +
    accion.salida_real * tarifa.salida_microusd_por_token
  );
}

export function ejecutarEscenario(escenario, limites, tarifas) {
  const estado = {
    escenario: escenario.id,
    estado: "completado",
    motivo: null,
    pasos_ejecutados: 0,
    coste_microusd: 0,
    coste_reservado_evitable: 0,
    llamadas_por_tool: {},
    fingerprints: {},
    progreso_ultimo: null,
    repeticiones_sin_progreso: 0,
    traza: []
  };

  for (const [indice, accion] of escenario.acciones.entries()) {
    const fp = fingerprint(accion);
    const reserva = costeReservado(accion, tarifas);
    const llamadas = accion.tipo === "tool" ? (estado.llamadas_por_tool[accion.tool] ?? 0) + 1 : 0;
    const repeticionesFp = fp ? (estado.fingerprints[fp] ?? 0) + 1 : 0;
    const repeticionesProgreso =
      accion.progreso === estado.progreso_ultimo ? estado.repeticiones_sin_progreso + 1 : 1;

    let motivo = null;
    if (accion.elapsed_ms > limites.max_runtime_ms) motivo = "runtime";
    else if (estado.pasos_ejecutados >= limites.max_pasos) motivo = "max_pasos";
    else if (fp && repeticionesFp >= limites.max_fingerprint_repetido) motivo = "fingerprint_repetido";
    else if (accion.tipo === "tool" && llamadas > limites.max_llamadas_por_tool) motivo = "cuota_tool";
    else if (repeticionesProgreso >= limites.max_sin_progreso) motivo = "sin_progreso";
    else if (estado.coste_microusd + reserva > limites.max_coste_microusd) motivo = "presupuesto_reservado";

    if (motivo) {
      estado.estado = "detenido";
      estado.motivo = motivo;
      estado.coste_reservado_evitable = reserva;
      estado.traza.push({
        paso_propuesto: indice + 1,
        decision: "bloquear",
        motivo,
        coste_actual_microusd: estado.coste_microusd,
        coste_reservado_microusd: reserva
      });
      break;
    }

    const coste = costeReal(accion, tarifas);
    estado.pasos_ejecutados += 1;
    estado.coste_microusd += coste;
    if (accion.tipo === "tool") estado.llamadas_por_tool[accion.tool] = llamadas;
    if (fp) estado.fingerprints[fp] = repeticionesFp;
    estado.progreso_ultimo = accion.progreso;
    estado.repeticiones_sin_progreso = repeticionesProgreso;
    estado.traza.push({
      paso: indice + 1,
      decision: "ejecutar",
      tipo: accion.tipo,
      coste_real_microusd: coste,
      coste_acumulado_microusd: estado.coste_microusd,
      progreso: accion.progreso
    });
  }

  return estado;
}

export function coincideEsperado(resultado, esperado) {
  return ["estado", "motivo", "pasos_ejecutados", "coste_microusd"].every(
    (campo) => resultado[campo] === esperado[campo]
  );
}
