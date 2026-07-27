# Brief educativo

## Problema

Quien aprende MCP suele conectar primero una herramienta amplia y real. Eso mezcla protocolo, permisos, datos personales, credenciales y comportamiento del modelo en una sola prueba difícil de diagnosticar.

## Resultado

El alumno construye un servidor local sobre doce pedidos sintéticos, publica tres tools estrechas y demuestra mediante un cliente determinista que no existe ninguna capacidad de escritura.

## Audiencia

Personal técnico de pymes, administradores de sistemas, desarrolladores junior y estudiantes que ya saben ejecutar comandos de Node.js.

## Criterios de aceptación

1. Instalación reproducible con versiones fijadas.
2. Tres tools y ninguna operación con efectos.
3. Datos sintéticos sin PII.
4. Esquemas que rechazan IDs, estados y límites inválidos.
5. Sin red durante la ejecución, secretos ni puerto abierto.
6. Ocho pruebas, conexión real por `stdio`, cliente de demostración y auditoría local.
7. Instrucciones de conexión y retirada para Codex.

## Fuera de alcance

No enseña OAuth, despliegue HTTP, escritura en un ERP ni conexión a datos empresariales. Esas capacidades requieren un laboratorio posterior con identidad, autorización, registros y aprobación humana.
