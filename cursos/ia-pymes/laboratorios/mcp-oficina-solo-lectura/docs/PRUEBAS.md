# Plan de pruebas

| Caso | Riesgo cubierto | Resultado esperado |
|---|---|---|
| Inventario de tools | Superficie mayor de la declarada | Exactamente tres |
| Anotaciones | Tool presentada como ambigua o destructiva | Todas de lectura, idempotentes y cerradas |
| Consulta conocida | Exposición de campos innecesarios | Solo cinco campos no personales |
| Ausencia | Alucinación ante un ID inexistente | `encontrado: false` |
| Traversal en ID | Lectura de una ruta arbitraria | Rechazo del esquema |
| Límite 11 | Volcado excesivo | Rechazo del esquema |
| Resumen | Cálculo no conciliado | 12 pedidos y 111.590 céntimos |

La auditoría estática añade comprobaciones contra secretos reconocibles, herramientas de escritura, enlace a todas las interfaces, llamadas HTTP y uso de stdout por el servidor.
