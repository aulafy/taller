# Brief educativo

## Problema

Las lecciones de RAG explicaban citas, abstención y permisos, pero no permitían comprobarlos. Leer una definición no enseña a separar un fallo de retrieval de uno de generación.

## Entregable

Un corpus sintético multi-tenant, diez preguntas de control, una salida defectuosa, una solución y un evaluador sin dependencias.

## Criterios

- Recuperación filtrada antes del ranking.
- Cero acceso cruzado entre Acme y Beta.
- Documento hostil excluido por cuarentena.
- Citas existentes y presentes en los resultados recuperados.
- Abstención exacta cuando no hay evidencia.
- Ocho pruebas y auditoría local.

## Fuera de alcance

No compara embeddings, modelos ni bases vectoriales y no afirma medir soporte semántico general. Es una base pedagógica para añadir después esas capas sin perder los controles.
