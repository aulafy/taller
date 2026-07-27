# Pruebas

## Automáticas

```bash
npm test
npm run verificar
```

Cubren:

- aceptación de `localhost` y direcciones IPv4 de loopback;
- rechazo de HTTPS, LAN, Internet, credenciales y rutas intermedias;
- conversión de las métricas en nanosegundos de Ollama;
- respuesta correcta y error HTTP de una API local simulada;
- ausencia de patrones de claves, cloud y exposición en el código ejecutable.

## Manuales con Ollama

```bash
npm run diagnostico
OLLAMA_MODEL=gemma3:4b npm run probar
```

Sustituye el modelo por uno que ya aparezca en `ollama list`. No descargues un
modelo sin revisar tamaño, ficha y licencia.

## Casos negativos

```bash
OLLAMA_BASE_URL=http://192.168.1.20:11434 npm run diagnostico
OLLAMA_BASE_URL=https://127.0.0.1:11434 npm run diagnostico
OLLAMA_MODEL=no-existe npm run probar
```

Las tres órdenes deben fallar sin realizar una generación.
