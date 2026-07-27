# Auditoría de chats compartidos

Laboratorio sin red para aprender a inventariar, clasificar y revocar enlaces de conversaciones compartidas sin usar cuentas ni datos reales.

## Objetivo

Una URL compartida no es “solo una respuesta”: puede mostrar parte o toda una conversación y escapar de la audiencia prevista. Aquí practicarás con enlaces `.invalid` reservados y una política comprobable.

## Ejecutar

Requiere Node.js 20.11 o posterior. No instala dependencias ni realiza peticiones de red.

```bash
npm run auditar
```

La primera auditoría **debe fallar**: `DEMO-002` es confidencial, sigue activo, no se verificó y se marcó erróneamente para mantener.

Corrige una copia del inventario y ejecuta:

```bash
node scripts/auditar.mjs ruta/a/tu-inventario.json
```

Compara después con la solución:

```bash
npm run verificar
```

## Criterio de éxito

- `sin_verificar` vale `0`;
- `inseguros_despues` vale `0`;
- todo enlace confidencial o secreto todavía activo se marca para revocar;
- solo se usan URL ficticias bajo `.invalid`;
- la evidencia no contiene secretos.

Revocar reduce la exposición futura, pero no recupera capturas, copias, importaciones ni publicaciones externas ya realizadas.

## Seguridad

No sustituyas los datos ficticios por enlaces o contenido de tus cuentas. Para una auditoría real, trabaja en la interfaz del proveedor, no publiques el inventario y registra solo conteos y decisiones sin datos personales.

## Fuentes oficiales

- [Claude: compartir y dejar de compartir chats](https://support.claude.com/en/articles/10593882-share-and-unshare-chats)
- [ChatGPT: preguntas frecuentes sobre enlaces compartidos](https://help.openai.com/en/articles/7925741-chatgpt-shared-links-faq)
- [Gemini: compartir chats](https://support.google.com/gemini/answer/13743730)

Verificado el 27 de julio de 2026.
