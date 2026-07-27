# Taller de Aulafy

Ejemplos ejecutables, proyectos guiados y laboratorios de los cursos de [Aulafy](https://www.aulafy.net/), organizados en español y publicados con licencia MIT.

Este repositorio no pretende ser una colección de demostraciones perfectas. Cada ejemplo debe enseñar un problema concreto, permitir reproducirlo, explicar las decisiones y dejar una forma clara de verificar y deshacer cambios.

## Qué encontrarás

- **Casos completos:** proyectos de principio a fin vinculados a un curso.
- **Ejemplos pequeños:** una técnica o decisión aislada y comprobable.
- **Laboratorios:** un estado roto seguro, su diagnóstico y una corrección con prueba de regresión.
- **Plantillas:** estructura reutilizable para aportar ejemplos nuevos.

## Organización

```text
cursos/
  crear-webs-con-ia/
    casos/
    ejemplos/
    laboratorios/
  codex-programadores/
    laboratorios/
plantillas/
  ejemplo-aulafy/
docs/
  estandar-ejemplos.md
catalogo.json
```

Cada ejemplo es autónomo: tiene sus propias instrucciones, dependencias, variables documentadas y pruebas. No necesitas instalar todos los proyectos del repositorio.

## Empezar

1. Abre [`catalogo.json`](./catalogo.json) y elige un ejemplo.
2. Entra únicamente en su carpeta.
3. Lee su `README.md` y `AGENTS.md` antes de ejecutar comandos.
4. Copia `.env.example` solo cuando el ejemplo lo indique; nunca uses claves reales en laboratorios.
5. Ejecuta la comprobación del ejemplo y guarda la evidencia solicitada.

Para comprobar la estructura general del repositorio:

```bash
npm run verificar
```

## Principios editoriales

1. Todo el contenido pedagógico y los mensajes visibles están en español.
2. No se inventan clientes, testimonios, credenciales, precios ni resultados.
3. Los datos son sintéticos y las claves son marcadores inequívocamente falsos.
4. Cada cambio funcional tiene una comprobación reproducible.
5. Accesibilidad, seguridad, privacidad y recuperación forman parte del ejemplo.
6. Las versiones instaladas y la fecha de última verificación quedan documentadas.
7. Las fuentes técnicas principales son oficiales.

## Relación con los cursos

Los itinerarios preparados incluyen [`crear-webs-con-ia`](./cursos/crear-webs-con-ia/README.md), asociado al curso **Crea webs profesionales con IA desde cero**, y [`higiene-repositorio-agentes`](./cursos/codex-programadores/laboratorios/higiene-repositorio-agentes/), donde se practica cómo reducir código redundante sin alterar el comportamiento. El catálogo crecerá a medida que Aulafy publique y revise ejemplos de otros cursos.

## Contribuir

Consulta [`CONTRIBUTING.md`](./CONTRIBUTING.md) y el [`estándar de ejemplos`](./docs/estandar-ejemplos.md). Una aportación no se considera terminada hasta que otra persona puede iniciarla y verificarla siguiendo únicamente su documentación.

## Seguridad

No abras una incidencia pública si descubres una credencial válida o una exposición de datos. Sigue [`SECURITY.md`](./SECURITY.md).

## Licencia

El código y la documentación de este repositorio se publican bajo la [licencia MIT](./LICENSE), salvo que una carpeta indique expresamente una licencia compatible distinta para un recurso de terceros.
