# Nexo Claro Legal: web estática para un despacho

Caso completo para aprender a presentar servicios profesionales con claridad, límites y una captación prudente, sin framework ni servicios externos.

> **Proyecto educativo ficticio.** El despacho, las personas, la dirección y los contactos son sintéticos. Esta web no presta servicios jurídicos ni sustituye el asesoramiento profesional.

## Problema

Una persona responsable de un pequeño negocio necesita saber si el despacho trabaja su tipo de consulta, cómo sería el primer contacto y qué información puede compartir de forma segura. La web debe orientarla sin prometer resultados ni pedirle que relate el asunto en un formulario abierto.

## Aprenderás

- traducir servicios complejos a preguntas que una persona reconoce;
- crear una arquitectura multipágina para un servicio profesional;
- demostrar proceso y límites sin inventar autoridad;
- diseñar una llamada a la acción proporcionada al riesgo;
- reducir datos en un formulario y aplicar mejora progresiva;
- preparar metadata, JSON-LD, sitemap y robots;
- comprobar rutas, contenido y restricciones con pruebas sin dependencias.

## No cubre

- asesoramiento jurídico ni adaptación a una jurisdicción real;
- relación abogado-cliente, conflicto de interés o aceptación de un encargo;
- envío, almacenamiento o cifrado de información;
- cuentas, panel privado, firma, pagos o intercambio de documentos;
- afirmaciones sobre profesionales, colegiación, casos o resultados reales.

## Resultado esperado

Una web con Inicio, Áreas, Proceso, Contacto y Privacidad. El contacto solicita únicamente los datos mínimos para preparar un correo local. No existe caja para explicar el caso y nada se transmite o almacena en la web.

## Requisitos verificados

- Node.js 20 o superior para el servidor y el verificador.
- Navegador moderno.
- No hay dependencias que instalar.

## Inicio rápido

```bash
cd cursos/crear-webs-con-ia/casos/despacho-abogados-estatico
npm start
```

Abre <http://localhost:4174>. Detén el servidor con `Ctrl+C`.

## Comprobar

```bash
npm test
```

Después sigue la revisión manual de [`docs/PRUEBAS.md`](./docs/PRUEBAS.md).

## Desplegar en Vercel

**Demo pública:** pendiente de despliegue.

Importa `aulafy/taller` y configura esta carpeta como **Root Directory**:

```text
cursos/crear-webs-con-ia/casos/despacho-abogados-estatico
```

No necesita comando de compilación, variables de entorno ni servicios externos. Cuando exista una URL pública, añádela al catálogo y sustituye los dominios `.example` solo si el proyecto deja de ser una demostración ficticia.

## Estructura

```text
index.html          Propuesta, situaciones y límites
areas.html          Áreas explicadas desde la necesidad
proceso.html        Recorrido, preparación y urgencias
contacto.html       Contacto mínimo sin relato del asunto
privacidad.html     Tratamiento de datos del prototipo
assets/             Sistema visual y mejora progresiva
scripts/            Servidor y verificador sin dependencias
docs/               Brief, pruebas y registro de verificación
```

## Errores frecuentes

| Síntoma | Causa probable | Recuperación |
|---|---|---|
| El puerto 4174 está ocupado | Otro servidor sigue activo | Detén ese proceso o usa `PORT=4175 npm start` |
| El correo no se abre | No existe aplicación asociada a `mailto:` | Copia el resumen visible y usa tu correo manualmente |
| Quieres explicar el asunto | El formulario lo evita deliberadamente | Espera a disponer de un canal aprobado por el profesional real |
| Una página devuelve 404 | Se abrió una ruta incorrecta | Vuelve a Inicio y ejecuta `npm test` |
| El formulario no continúa | Falta un campo obligatorio o el consentimiento | Lee el mensaje del navegador y revisa el control señalado |

## Restaurar y limpiar

La web no crea cuentas, cookies ni archivos. Cierra cualquier borrador de correo sin enviarlo, detén el servidor con `Ctrl+C` y descarta los cambios desde una rama o commit conocido.

## Curso y fuentes

- Curso: [Crea webs profesionales con IA desde cero](https://www.aulafy.net/cursos/crear-webs-con-ia)
- Taller: web para un despacho de abogados.
- Las referencias técnicas y editoriales están documentadas en [`docs/BRIEF.md`](./docs/BRIEF.md).

Publicado bajo licencia MIT.
