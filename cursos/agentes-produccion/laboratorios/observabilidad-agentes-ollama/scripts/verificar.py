"""Comprobación sin red: protege el contrato pedagógico del laboratorio."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
required = [
    ".env.example",
    "requirements.txt",
    "data/conocimiento-demo.json",
    "src/app.py",
    "docs/BRIEF.md",
    "docs/PRUEBAS.md",
    "docs/VERIFICADO.md",
    "docs/SETUP-LOCAL.md",
]
for file_name in required:
    assert (ROOT / file_name).exists(), f"Falta {file_name}"

code = (ROOT / "src/app.py").read_text()
for token in ["@observe", 'as_type="retriever"', 'as_type="tool"', 'as_type="generation"', 'as_type="agent"', "propagate_attributes", "get_client().flush()"]:
    assert token in code, f"Falta el patrón educativo: {token}"

env = (ROOT / ".env.example").read_text()
assert "sk-lf-" in env and "OLLAMA_BASE_URL" in env, "Faltan variables documentadas"
assert "datos sintéticos" in (ROOT / "README.md").read_text().lower(), "El README debe declarar datos sintéticos"
print("Contrato del laboratorio verificado: estructura, seguridad y trazas esperadas.")
