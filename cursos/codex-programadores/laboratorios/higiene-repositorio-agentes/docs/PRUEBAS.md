# Pruebas

## Estado inicial

```bash
npm test
# esperado: código 0; 3 pruebas superadas

npm run auditar
# esperado: código 1; informa de tres wrappers y 6 exports
```

El fallo de `auditar` es parte del ejercicio, no un fallo de instalación.

## Solución de referencia

```bash
npm run test:solucion
# esperado: código 0; 3 pruebas superadas

npm run auditar:solucion
# esperado: código 0; 3 funciones públicas y ningún wrapper legado
```

## Comprobación manual del alumno

1. Ejecutar pruebas antes de editar.
2. Modificar únicamente `src/tasks.mjs`.
3. Ejecutar pruebas y auditoría.
4. Confirmar con `git diff --numstat -- src/tasks.mjs` que hay más eliminaciones que adiciones.
5. Leer el diff completo y justificar cada eliminación.

## Casos negativos

- Si se borra `normalizeText`, las pruebas no pueden importar la API.
- Si se conserva cualquiera de los tres wrappers, la auditoría falla.
- Si se añaden exports para ocultar la refactorización, la auditoría falla.
