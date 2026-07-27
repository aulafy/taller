# Tu primer MCP seguro: oficina de demostración y solo lectura

Este laboratorio crea un servidor MCP local para consultar doce pedidos sintéticos. Enseña el patrón mínimo antes de conectar correo, facturas, un CRM o un ERP:

```text
datos mínimos → tres tools estrechas → solo lectura → esquema → prueba → conexión al cliente
```

No necesita API de IA, cuenta, clave, base de datos ni conexión de red durante la ejecución.

## Qué vas a comprobar

- El servidor publica exactamente tres herramientas.
- Todas declaran `readOnlyHint: true` y `destructiveHint: false`.
- Los argumentos se validan antes de ejecutar el código.
- Un límite máximo evita volcados accidentales.
- No hay nombres, correos, direcciones ni datos bancarios.
- No hay herramientas para crear, editar o borrar.
- Los importes se mantienen en céntimos enteros.

## Requisitos e instalación

Necesitas Node.js 20.11 o posterior. Revisa primero `package.json`; después instala las dos dependencias fijadas:

```bash
npm install
npm run verificar
```

Resultado esperado:

```text
8 tests
Auditoría superada: datos sintéticos, tres tools de lectura, sin red, secretos ni escritura.
```

La instalación sí consulta el registro de npm. La ejecución y las pruebas no llaman a servicios externos;
una de ellas inicia el proceso real por `stdio` y las demás trabajan en memoria.

## Explora sin conectar un modelo

```bash
npm run probar
```

El cliente de prueba se conecta en memoria, enumera las tools y realiza dos consultas. Así separas dos preguntas:

1. ¿Funciona el servidor?
2. ¿Ha decidido bien el modelo cuándo usarlo?

Este laboratorio responde primero a la pregunta determinista.

También puedes usar el inspector oficial:

```bash
npx @modelcontextprotocol/inspector node src/servidor.mjs
```

El inspector abre una interfaz local. No introduzcas datos reales.

## Conectarlo a Codex

Desde esta carpeta:

```bash
codex mcp add aulafy-oficina -- node "$PWD/src/servidor.mjs"
codex mcp list
```

En Codex puedes consultar `/mcp` y pedir:

> Usa únicamente `aulafy-oficina`. ¿Cuántos pedidos tienen incidencia? Cita los IDs y no propongas cambios.

Cuando termines:

```bash
codex mcp remove aulafy-oficina
```

No copies esta configuración a producción. Es un servidor didáctico local, sin autenticación, cuyo transporte `stdio` solo debe ser iniciado por el cliente.

## Antes de conectar datos reales

1. Define qué pregunta necesita responder el negocio.
2. Reduce cada tool a una operación y un esquema estrecho.
3. Devuelve solo los campos imprescindibles.
4. Empieza con lectura; no añadas escritura por comodidad.
5. Guarda secretos fuera del repositorio.
6. Añade autorización por usuario y alcance si pasas a HTTP.
7. Trata las descripciones recuperadas como datos no fiables.
8. Registra llamadas sin copiar datos sensibles al log.
9. Prueba entradas inválidas, límites y ausencia de resultados.
10. Exige aprobación humana antes de cualquier efecto real.

## Riesgos que este ejemplo evita a propósito

- **Prompt injection:** ningún campo libre del dataset puede convertirse en una instrucción.
- **Exceso de permisos:** no existe código de escritura.
- **Exfiltración masiva:** cada lista está limitada a diez elementos.
- **Credenciales filtradas:** el servidor no usa ni acepta secretos.
- **Servidor expuesto:** se usa `stdio`, no un puerto abierto.
- **Coste opaco:** el laboratorio no llama a ningún LLM.

Las anotaciones comunican intención al cliente, pero no sustituyen el control de acceso. Una garantía real exige que el servidor carezca de la capacidad que promete no utilizar.

## Versiones y mantenimiento

- Node.js: 20.11 o posterior.
- `@modelcontextprotocol/sdk`: 1.30.0, rama estable v1.
- `zod`: 3.25.76.
- Última verificación: 27 de julio de 2026.

Antes de actualizar una dependencia, ejecuta `npm run verificar`, revisa el registro de cambios oficial y vuelve a inspeccionar las tools publicadas.

## Fuentes primarias

- [Documentación oficial de MCP](https://modelcontextprotocol.io/docs/getting-started/intro)
- [Prácticas de seguridad de MCP](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
- [SDK oficial TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP en Codex](https://learn.chatgpt.com/docs/extend/mcp)

Este código se publica con licencia MIT como parte de Aulafy Taller.
