# Lumbre y Oliva: web estática de un restaurante

Caso completo para aprender a pasar de un briefing a una web móvil, accesible y verificable sin framework ni servicios externos.

> **Negocio ficticio.** Nombres, dirección, contacto, platos, precios y horarios son datos sintéticos para aprendizaje. No representan un restaurante real.

## Problema

Una persona busca desde el móvil qué se sirve, cuánto cuesta, cuándo abre el restaurante y cómo solicitar una reserva. La web debe responder sin obligarla a descargar un PDF ni crear una cuenta.

## Aprenderás

- organizar una web pequeña en cuatro páginas;
- construir una carta semántica en HTML;
- diseñar móvil primero y sin recursos externos;
- comunicar precios, alérgenos, horarios y límites;
- preparar una solicitud de reserva sin backend ni envío automático;
- añadir metadata, canonical, JSON-LD, sitemap y robots;
- comprobar estructura, enlaces y contenido con un script sin dependencias.

## No cubre

- disponibilidad o confirmación en tiempo real;
- almacenamiento de reservas;
- pagos, cuentas de usuario o panel interno;
- envío automático de email;
- adaptación legal a un negocio o jurisdicción reales.

## Resultado esperado

Una web con Inicio, Carta, Visita y privacidad. La solicitud valida los datos en el navegador y genera un enlace `mailto:`; la persona decide después si abre su aplicación de correo. La web no recibe ni almacena el formulario.

## Requisitos verificados

- Node.js 20 o superior para servidor y verificador.
- Navegador moderno.
- No hay dependencias que instalar.

## Inicio rápido

```bash
cd cursos/crear-webs-con-ia/casos/restaurante-estatico
npm start
```

Abre <http://localhost:4173>. Detén el servidor con `Ctrl+C`.

## Comprobar

```bash
npm test
```

Después sigue la revisión manual de [`docs/PRUEBAS.md`](./docs/PRUEBAS.md).

## Estructura

```text
index.html          Inicio y datos estructurados
carta.html          Carta HTML y alérgenos
visita.html         Horario y solicitud de reserva
privacidad.html     Tratamiento de datos del prototipo
assets/styles.css   Sistema visual responsive
assets/app.js       Mejora progresiva del formulario
scripts/            Servidor y verificador sin dependencias
docs/               Brief, pruebas y registro de verificación
```

## Errores frecuentes

| Síntoma | Causa probable | Recuperación |
|---|---|---|
| El puerto 4173 está ocupado | Otro servidor sigue activo | Detén el proceso identificado o usa `PORT=4174 npm start` |
| El correo no se abre | No hay aplicación asociada a `mailto:` | Copia el resumen visible y usa tu correo manualmente |
| Una ruta devuelve 404 | Se abrió un archivo con nombre incorrecto | Vuelve a Inicio y ejecuta `npm test` |
| El formulario no continúa | Falta un campo o la fecha no es válida | Lee el mensaje del navegador y corrige el campo marcado |

## Restaurar y limpiar

La web no crea cuentas ni almacena datos. Detén el servidor con `Ctrl+C` y descarta los cambios con Git desde una rama o commit conocido. No se generan archivos durante el uso normal.

## Curso y fuentes

- Curso: [Crea webs profesionales con IA desde cero](https://www.aulafy.net/cursos/crear-webs-con-ia)
- Taller: web para un restaurante.
- Referencias técnicas dentro de `docs/BRIEF.md` y de cada página.

Publicado bajo la licencia MIT del repositorio.
