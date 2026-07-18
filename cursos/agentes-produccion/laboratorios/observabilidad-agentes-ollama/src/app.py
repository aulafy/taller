"""Laboratorio mínimo: Ollama + Langfuse, RAG sintético, una tool y trazas legibles.

No es un servicio de producción. Su propósito es enseñar qué observaciones crear
y cómo diagnosticar una respuesta antes de integrar bases de datos o acciones reales.
"""

from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from langfuse import get_client, observe, propagate_attributes
from langfuse.openai import OpenAI

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")


def required(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Falta {name}. Copia .env.example a .env y completa el entorno local.")
    return value


def user_alias(user_id: str) -> str:
    """No propaga un identificador personal al laboratorio."""
    return f"demo-{hashlib.sha256(user_id.encode()).hexdigest()[:12]}"


@observe(name="recuperar-fuentes", as_type="retriever")
def recuperar_fuentes(pregunta: str, tenant: str = "demo") -> list[dict[str, str]]:
    """Retriever deliberadamente simple; sustituye solo esta función en un RAG real."""
    documentos = json.loads((ROOT / "data" / "conocimiento-demo.json").read_text())
    palabras = {palabra.strip("¿?.,").lower() for palabra in pregunta.split()}
    resultados: list[dict[str, str]] = []
    for documento in documentos:
        if documento["tenant"] != tenant:
            continue
        coincidencias = sum(palabra in documento["texto"].lower() for palabra in palabras)
        if coincidencias:
            resultados.append(
                {
                    "documento_id": documento["documento_id"],
                    "version": documento["version"],
                    "seccion": documento["seccion"],
                    "extracto": documento["texto"],
                    "score": str(coincidencias),
                }
            )
    return resultados[:3]


@observe(name="consultar-estado-pedido", as_type="tool")
def consultar_estado_pedido(pedido_id: str) -> dict[str, str]:
    """Tool de solo lectura con respuesta sintética: no consulta ni modifica servicios externos."""
    if pedido_id != "demo-1042":
        return {"estado": "no_encontrado", "pedido_id": pedido_id}
    return {"estado": "pendiente_de_revision", "pedido_id": pedido_id}


@observe(name="generar-respuesta", as_type="generation")
def generar_respuesta(pregunta: str, fuentes: list[dict[str, str]], estado_pedido: dict[str, str]) -> str:
    if not fuentes:
        return "No tengo evidencia suficiente en la documentación de demostración. Solicita revisión humana."

    client = OpenAI(base_url=required("OLLAMA_BASE_URL"), api_key="ollama")
    contexto = "\n".join(
        f"[{fuente['documento_id']}:{fuente['version']}:{fuente['seccion']}] {fuente['extracto']}"
        for fuente in fuentes
    )
    respuesta = client.chat.completions.create(
        name="ollama-chat-soporte",
        model=required("OLLAMA_MODEL"),
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": "Eres un asistente de soporte. Responde solo con la evidencia aportada. Si falta evidencia, dilo. No ejecutes acciones.",
            },
            {
                "role": "user",
                "content": f"Pregunta: {pregunta}\nEstado sintético: {estado_pedido['estado']}\nFuentes:\n{contexto}",
            },
        ],
    )
    return respuesta.choices[0].message.content or "No se obtuvo contenido del modelo."


@observe(name="resolver-consulta-soporte", as_type="agent")
def resolver_consulta(pregunta: str, user_id: str = "alumno-demo", session_id: str = "sesion-demo-001") -> str:
    """Orquesta pasos visibles. No guarda cadenas de razonamiento privadas."""
    with propagate_attributes(
        user_id=user_alias(user_id),
        session_id=session_id,
        metadata={"entorno": "laboratorio", "prompt_version": "v1", "datos": "sinteticos"},
        version="v1",
        tags=["aulafy", "observabilidad", "laboratorio"],
    ):
        fuentes = recuperar_fuentes(pregunta)
        estado_pedido = consultar_estado_pedido("demo-1042")
        return generar_respuesta(pregunta, fuentes, estado_pedido)


def main() -> None:
    pregunta = "¿Cuánto tiempo tengo para devolver un pedido?"
    print(resolver_consulta(pregunta))
    # En scripts breves, fuerza el envío de eventos antes de que termine el proceso.
    get_client().flush()


if __name__ == "__main__":
    main()
