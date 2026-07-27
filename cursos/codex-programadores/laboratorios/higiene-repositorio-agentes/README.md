# Higiene de repositorios con agentes de código

## 1. Qué problema resuelve

Un agente puede entregar una funcionalidad correcta y, a la vez, dejar wrappers redundantes, alias antiguos o una API pública mayor de lo necesario. Este laboratorio enseña a reducir esa deuda con una tarea pequeña y medible.

El código de `src/tasks.mjs` funciona, pero contiene tres capas que no aportan comportamiento. El reto es eliminarlas sin cambiar la salida observable.

## 2. Qué aprenderás

- fijar una línea base antes de editar;
- encargar una refactorización acotada a Codex o Claude Code;
- distinguir pruebas de comportamiento de una auditoría estructural;
- revisar adiciones y eliminaciones en el diff;
- rechazar una solución que «pasa» porque debilitó las pruebas.

No cubre optimización de rendimiento, migraciones grandes ni análisis automático completo de código muerto.

## 3. Resultado esperado

Al terminar:

```text
npm test
# 3 pruebas superadas

npm run auditar
# Auditoría superada
```

La API pública tendrá tres funciones y el comportamiento será idéntico al inicial.

## 4. Requisitos verificados

- Node.js 20 o posterior.
- Git 2.39 o posterior.
- Codex o Claude Code son opcionales: puedes realizar el ejercicio manualmente.
- No requiere cuenta, clave, red, dependencias ni datos reales.

## 5. Inicio rápido

```bash
cd cursos/codex-programadores/laboratorios/higiene-repositorio-agentes
npm test
npm run auditar
```

La primera orden debe pasar. La segunda debe fallar y enumerar los wrappers redundantes: ese fallo es el estado inicial esperado.

Haz un commit o conserva una copia antes de modificar `src/tasks.mjs`. Después entrega este encargo al agente:

```text
Objetivo: reduce la redundancia de src/tasks.mjs sin cambiar su comportamiento.

Contexto:
- test/tasks.test.mjs define la API y los casos que deben seguir funcionando.
- AGENTS.md contiene las reglas del laboratorio.

Límites:
- modifica solo src/tasks.mjs;
- no añadas dependencias;
- no cambies ni elimines pruebas;
- elimina wrappers y exports que no aporten comportamiento;
- evita crear nuevas abstracciones.

Terminado cuando:
- npm test pasa;
- npm run auditar pasa;
- el diff contiene más líneas eliminadas que añadidas;
- puedes explicar cada eliminación.
```

## 6. Comprobación

```bash
npm test
npm run auditar
git diff --numstat -- src/tasks.mjs
git diff -- src/tasks.mjs
```

Existe una referencia revisable en `solucion/tasks.mjs`. No la abras antes de intentarlo. Puedes comprobarla sin sustituir tu archivo:

```bash
npm run test:solucion
npm run auditar:solucion
```

## 7. Errores frecuentes

- borrar una función cubierta por la API pública;
- cambiar pruebas para que acepten otro comportamiento;
- añadir una nueva clase o dependencia para eliminar tres wrappers;
- aceptar «tests verdes» sin leer el diff;
- confundir menos líneas con mejor diseño sin comprobar nombres y contrato.

## 8. Restauración y limpieza

Para descartar únicamente tu ejercicio:

```bash
git restore src/tasks.mjs
```

No uses `git reset --hard`: podría eliminar otros cambios del repositorio.

## 9. Curso y fuentes

Laboratorio asociado a [Codex para programadores](https://www.aulafy.net/cursos/codex-programadores).

- [Codex · Best practices](https://learn.chatgpt.com/guides/best-practices) — alcance, contexto, definición de terminado, pruebas y revisión.
- [Claude Code · Best practices](https://code.claude.com/docs/en/best-practices) — verificación, planificación, contexto e instrucciones concisas.

Código, pruebas y documentación: licencia MIT.
