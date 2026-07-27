# Evidencia de verificación

Estado: **VERIFICADO**

Última comprobación: 27 de julio de 2026.

Entorno:

- Node.js 20.11 o posterior;
- cero dependencias externas;
- red desactivada por diseño;
- tarifas exclusivamente ficticias.

Resultado:

- 8 de 8 pruebas correctas;
- 7 de 7 escenarios coinciden con su resultado esperado;
- auditoría de estructura, límites, tarifas, secretos y URLs superada;
- el escenario sano completa cuatro pasos con un coste simulado de 4.200 microusd;
- los seis escenarios adversarios se detienen antes de ejecutar la acción prohibida.

Comando reproducible:

```bash
npm run verificar
```
