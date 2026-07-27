# Evidencia de verificación

Verificado el 27 de julio de 2026 con Node.js y las dependencias fijadas en `package-lock.json`.

Comandos:

```bash
npm install
npm run verificar
```

Resultado:

- 8 de 8 pruebas superadas, incluida una conexión real por `stdio`;
- 3 tools publicadas y anotadas como solo lectura;
- 12 registros sintéticos y 0 campos personales;
- IDs y límites inválidos rechazados por el esquema;
- resumen conciliado: 12 pedidos y 111.590 céntimos;
- auditoría sin red, secretos, puertos ni funciones de escritura;
- `npm audit`: 0 vulnerabilidades conocidas en la instalación comprobada.
